import mongoose, { MongooseDocumentMiddleware, ObjectId, Schema, mongo } from "mongoose";
import { playersDB, usersDB, plainsDB, gamesDB } from "../db/db-model";
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

        this.checksValidation(game!.toObject(), playerEnd!.toObject(), game!.hexagons[0].toObject()); //last par is pseudo because fun. requries it.

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
        
        await game?.save();
        await playerEnd?.save();

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

        this.checksValidation(gameDoc!.toObject(), playerDoc!.toObject(), 'redundant parameter');
        //Nuthin

        if(resources < 1000) {throw new Error("Not enough resources to create army");}
        let castle = gameDoc?.hexagons.find(h => h.ownerID == playerDoc?.id && h.toObject().type == 'army')
        gameDoc?.hexagons.forEach(h =>
        {
            if(h.toObject().type == 'a')
            {
              let a = 4;
            }

        })
        const io = getSocket.getInstance();
        io.of("main").to(gameID).emit("update_game");

    }

    async endTurn(gameID: string, playerID: string)
    {

            let ps = new PlayerService();
            let gs = new GameService();
            let player = await ps.get(playerID) as Player; //this.unit.players Ovo zbog obrazca da se popravi?
            if(player == null) return;
            let game = await gs.get(gameID) as Game; //this.unit.games
            if(game == null) return;
            if(game.turnForPlayerID != player._id?.toString())
                return;//send response false || throw error
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