import mongoose, { MongooseDocumentMiddleware, ObjectId, Schema, mongo } from "mongoose";
import { playersDB, usersDB, plainsDB, gamesDB, armiesDB } from "../db/db-model";
import { Game } from "../Model/Game";
import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player, PlayerStatus } from "../Model/Player";
import { BaseService } from "./base.service";
import { HexagonRepository } from "../repositories/hexagon.repository";
import { HexagonService } from "./hexagon.service";
import { Army } from "../Model/hexagons/Army";
import { error } from "console";
import { armySchema } from "../db/schema/Hexagons/ArmySchema";
import { Castle } from "../Model/hexagons/Castle";
import { GameService } from "./game.service";
import { sendResponse } from "../utils/response";
import getSocket from "../socket";
import { any, nullable, number } from "zod";
import { playerSchema } from "../db/schema/PlayerSchema";
import { type } from "os";
import ApplicationError from "../utils/error/application.error";
import { compareSync } from "bcrypt";

export class PlayerService extends BaseService
{
    hexagonRepository: HexagonRepository;
    constructor()
    {
        super();
        this.hexagonRepository = new HexagonRepository();
    }

    async create(player: Player, userID: string)
    {   
       

            const newPlayer = new playersDB(player);

            const user = await usersDB.findById(userID);

            newPlayer.user = user?._id;
            
            const result = await newPlayer.save();
            
            return result;

       

        return null
    }
    
    async get(playerID: string)
    {

       
            const player = await playersDB.findById(playerID);

            return player

       

    }
    
    async makeMove(gameID: string, playerID: string, hexagonSrcID: string, hexagonDstID: string)
    {
            //throw new ApplicationError({message:"nova poruka", code:440, type:ApplicationError.type.INTERNAL})
            
            // if(hexagonSrc.ownerID?._id == playerID)
            // {
                //middleware playerid == userid == tokeind
            // }

           
            let game = await gamesDB.findById(gameID) as Game;

            let player = await playersDB.findById(playerID) as Player;
                        
            let hexagonSrc = game?.hexagons.find(h=> h._id?.toString() == hexagonSrcID) as Army;
          // console.log(hexagonSrc);
            let hexagonDst = game.hexagons.find(h=> h._id?.toString() == hexagonDstID) as any;
          // console.log(hexagonDst);

            //WITHOUT this, Discriminator and derived properties aren't accesible(type D, sizes, moves) of Army
            //although you can read them within whole object (console.log(hexagon))
            //can make bugs(json token)
            hexagonSrc = JSON.parse(JSON.stringify(hexagonSrc));
            hexagonDst = JSON.parse(JSON.stringify(hexagonDst));

            //console.log(hexagonSrc, hexagonSrc.type, hexagonSrc.size, hexagonSrc.moves);
           // console.log(hexagonDst ,hexagonDst.type, hexagonDst.size, hexagonDst.moves); 

            this.checksValidation(game, player, hexagonSrc);
            this.checksValidation(game, player, hexagonDst);
            this.checkMoveLogic(game, player, hexagonSrc, hexagonDst);

                      
            let hs = new HexagonService();

            let payload: any;
            
            //console.log(hexagonDst, hexagonDst.type, hexagonDst.size, hexagonDst.moves);
            
           
            if(hexagonDst.type  == 'plain')
            {   
                await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);
             
            }
            else
            {
              if(hexagonDst.ownerID == hexagonSrc.ownerID && (hexagonDst.type == "mine" || hexagonDst.type == "castle" || hexagonDst.type == 'army')) 
              {throw new Error("Can't move on your army, mine or castle");}

              //3 slucaja: vojska polje, rudnik polje, tvrdjava polje
              //logic for points losing, calculation...
              if(hexagonDst.type == "mine")
              {
                await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst); //later: if mine has defence points, calculate army vs mine point with mb probability
              }
              else if (hexagonDst.type == "army")
              {
                if (hexagonSrc.size > hexagonDst.size) //Math.random() < 1/2
                {
                    await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst); //later: creating new Army
                }
                else          
                {
                  await hs.removeHexagon(gameID, hexagonSrc);
                }
              }
              else if (hexagonDst.type == "castle")
              {
                if (hexagonSrc.size > hexagonDst.size * 2)  //Math.random() < 1/4
                {
                    this.eliminatePlayer(gameID, hexagonDstID);
                }
                else          
                {
                  await hs.removeHexagon(gameID, hexagonSrc);
                }
              }
              else {throw new Error("Nemoguci slucaj");}
            }

            return payload;                     
    }

    async eliminatePlayer(gameID: string, playerEndID: string)
    {
        let game = await gamesDB.findById(gameID);
        let playerEnd = await playersDB.findById(playerEndID);

        this.checksValidation(game!.toObject(), playerEnd!.toObject(), game!.hexagons[0].toObject()); //last par is pseudo because funciton requires it.

        playerEnd!.playerStatus = PlayerStatus.Destroyed;
        playerEnd!.resources = -1;
        let hs = new HexagonService();

        game!.hexagons.forEach(h =>
            {
                if(h.ownerID == playerEnd?.id)
                {
                    hs.removeHexagon(game!._id?.toString()!, h.toObject());                    
                }
            })
        game!.numbOfPlayers! -= 1;
        game!.players = game!.players.filter(p => p._id.toString() != playerEnd!._id.toString());

        //endgame
        let playerWonDoc;
        let userWonDoc;
        if(game?.numbOfPlayers == 1) 
        {
            game.isFinished = true;
            game.playerWonID = game.players[0]!._id;

            playerWonDoc =await playersDB.findById(game.playerWonID);
            playerWonDoc!.playerStatus = PlayerStatus.Won;

            userWonDoc = await usersDB.findById(playerWonDoc!.user!); //!!!
            //If you use find(), you won't get access to properties.
        }

        await game?.save();
        await playerEnd?.save();
        await playerWonDoc?.save();
        
        if(game?.isFinished == true) 
        {console.log(`The game has finished. User with name ${userWonDoc?.username} and playerID ${playerWonDoc?.id} has won!
        Congratulations!`);}
        

        const io = getSocket.getInstance();
        io.of("main").to(gameID).emit("update_game");
    }

    async setResources(gameID: string, playerID: string, hexagonID: string, resources: number)
    {
        let game = await gamesDB.findById(gameID);
        let player = await playersDB.findById(playerID);
        let hexagon = game?.hexagons.find(h => h._id?.toString() == hexagonID) as any; 
        let ind: number = game!.hexagons.findIndex(h => h._id!.toString() == hexagonID);

        hexagon = JSON.parse(JSON.stringify(hexagon)); 

        this.checksValidation(game!.toObject(), player!.toObject(), hexagon);
        if(resources < 0) {throw new Error("Negative value for resources not allowed");}

        if(hexagon.ownerID.toString() != player!._id?.toString()) {throw new Error("Source hexagon with given ID doesn't belong to player");}
        

        if(hexagon.type == 'army' || hexagon.type == 'castle') 
        { game?.hexagons[ind].$set('size', hexagon.size + resources);}
        else if(hexagon.type == 'mine') 
        {game?.hexagons[ind].$set('revenue', hexagon.revenue + resources);}
        else 
        {throw new Error("Can't place resources on plain hexagon or unknown error");}

        player!.resources! -= resources;
        await game?.save();
        await player?.save();

        const io = getSocket.getInstance();
        io.of("main").to(gameID).emit("update_game");
                                
    }

    //async
    async createNewArmy(gameID: string, playerID: string, resources: number)
    {
        let gameDoc = await gamesDB.findById(gameID);
        let playerDoc = await playersDB.findById(playerID);
        //console.log(gameDoc, playerDoc);
        this.checksValidation(gameDoc!.toObject(), playerDoc!.toObject(), 'redundant parameter');
        //Nuthin
        if (gameDoc!.turnForPlayerID?.toString() != playerDoc!._id!.toString()) {throw new Error("Please wait for your turn to play");}

        //if(resources < 10) {throw new Error("Not enough resources to create army");}

        let castleDoc = gameDoc?.hexagons.find(h => h.ownerID == playerDoc?.id && h.toObject().type == 'castle');
        if (castleDoc == null) {throw new Error("Can't find players castle or player is destroyed");}
        let hs = new HexagonService();

        let flag = false;

        for (let h of gameDoc!.hexagons) //Typescript: can only use procedural statements(continue, break) in for loop, not in for-each loop.
        {
            

            if (hs.isHexaNeighboor(castleDoc!.toObject(), h.toObject()) && h.toObject().type == 'plain') 
            {
                console.log(h, h.toObject().type);

                gameDoc!.hexagons.push(new armiesDB({size: 10, moves: 3, hexaStatus: 1, ownerID: playerDoc?.id,
                     playerStatus: 0, points: 0, q: h.q, r: h.r, s: h.s,}));


                gameDoc?.hexagons.remove({_id: h._id});
                flag = true;
                break;
            }
         }

         if(flag == false) {throw new Error("There are no available plain hexagons neighbooring the player's castle");}

         playerDoc!.resources! -= resources;

         await gameDoc?.save();
         await playerDoc?.save();

        const io = getSocket.getInstance();
        io.of("main").to(gameID).emit("update_game");

    }

    async endTurn(gameID: string, playerID: string)
    {

            let ps = new PlayerService();
            
            let gs = new GameService();
            
            let player = await ps.get(playerID) as Player; //this.unit.players Ovo zbog obrazca da se popravi?
           
            //if(player == null) return;
            
            let game = await gs.get(gameID) as Game; //this.unit.games
            //if(game == null) throw Error("Game null");
            
            if(game.turnForPlayerID != player._id?.toString())
                return;//send response false || throw error

            await this.getResources(game, playerID);
            
            await this.addMoves(gameID, playerID);

            let newPlayerID: string = "";

            for(let i = 0; i < game.players.length; i++)
            {
                if(game.turnForPlayerID == game.players[i]._id?.toString())
                {
                    i = (i + 1) % game.players.length;
                  
                    newPlayerID = game.players[i]._id?.toString()!;

                    break;
                }
            }

            let payload = await gs.updateTurnForPlayer(game, newPlayerID);
            if(payload)
            {
                const io = getSocket.getInstance();
                io.of("main").to(gameID).emit("update_game"); 
            }
            
    }


    async addMoves(gameID: string, playerID: string)
    {
        let gameDoc = await gamesDB.findById(gameID);

        let playerDoc = await playersDB.findById(playerID);


        // for(let i = 0; i < gameDoc?.hexagons?.length; i++)
        // {

        // }
        gameDoc?.hexagons.forEach((hexagon: any) => {
            
            if(hexagon.ownerID == playerDoc?.id && hexagon.toObject().type == 'army')
            {
                hexagon.$set('moves', 2);
            }
        })

        await gameDoc?.save();

    }
    async getResources(game: Game, playerID: string)
    {
       
       
        let playerDoc = await playersDB.findById(playerID);
       
        let resources = 0;

        game.hexagons.forEach((hexagon: any) => {

            console.log(hexagon)
            if(hexagon.ownerID == playerDoc?.id && hexagon.toObject().type == 'mine')
            {
                resources++;
            }
        })
       
        if(playerDoc?.resources == undefined) throw Error("Players resources undefined");
       
        playerDoc.resources += resources;
        
        await playerDoc.save();
        
    }
    

    checkMoveLogic(game: Game, player: Player, hexagonSrc: Army, hexagonDst: Hexagon)
    {
        if (game.turnForPlayerID != player._id!.toString()) {throw new Error("Please wait for your turn to play");}
        if(hexagonSrc._id == hexagonDst._id) {throw new Error("Army can't jump to itself");}
        if(hexagonSrc.ownerID != player._id) {throw new Error("Source hexagon with given ID doesn't belong to player");}

        let hs = new HexagonService();
        let areNeighboors = hs.isHexaNeighboor(hexagonSrc, hexagonDst);
        if (areNeighboors == false) {throw new Error("Hexagons are not neighboors");}
    }

    async checksValidation(game: Game, player: Player, hexagonSrc: Hexagon | string)
    {
        
        if(game == null) {throw new Error("Game with given ID doesn't exist");}

        if(player == null) {throw new Error("Player with given ID doesn't exist");}

        if(hexagonSrc == null) {throw new Error("Source hexagon with given ID doesn't exist");}

    }
}