import mongoose, { MongooseDocumentMiddleware, ObjectId, Schema, mongo } from "mongoose";
import { playersDB, usersDB, plainsDB, gamesDB, armiesDB, messageDB } from "../db/db-model";
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
import { HexagonMoveStrategy, IMoveStrategy, PlainMoveStrategy} from "../strategy design pattern/IMoveStrategy";
import { Message } from "../Model/Message";
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

            
            if(hexagonDst.ownerID == hexagonSrc.ownerID && (hexagonDst.type == "mine" || hexagonDst.type == "castle" || hexagonDst.type == 'army')) 
            {throw new Error("Can't move on your army, mine or castle");}

                      
            let hs = new HexagonService();

            let payload: any;
            
            //console.log(hexagonDst, hexagonDst.type, hexagonDst.size, hexagonDst.moves);

            
            let strategy;
            if (hexagonDst.type == 'plain') {
            strategy = new PlainMoveStrategy();
            } else {
            strategy = new HexagonMoveStrategy();
            }
            await strategy.moveLogic(gameID, hexagonSrc, hexagonDst);

            

            return payload;                     
    }

    async eliminatePlayer(gameID: string, hexagonSrc:Army, hexagonDst: Castle)
    {
       // console.log(hexagonDstID);    
        let game = await gamesDB.findById(gameID);
        //let hexagonDst = game?.hexagons.find(h => h.id == hexagonDstID);
      //  console.log(hexagonDst);
        let playerEnd = await playersDB.findById(hexagonDst?.ownerID);
       // console.log(playerEnd);
       
        this.checksValidation(game!.toObject(), playerEnd!.toObject(), 'redundant parameter'); //last par is pseudo because funciton requires it.

        let hs = new HexagonService();
        //await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);
        // let ind = game!.hexagons.findIndex(h=> h.id == hexagonSrc._id);
        // game!.hexagons[ind].q = hexagonDst.q;
        // game!.hexagons[ind].r = hexagonDst.r;
        // game!.hexagons[ind].s = hexagonDst.s;

        playerEnd!.playerStatus = PlayerStatus.Destroyed;
        playerEnd!.resources = -1;
        


        await game?.save();
        for(let i=0; i<game!.hexagons.length; i++)
        {
            if(game?.hexagons[i].ownerID == playerEnd?.id)
                {
                    await hs.removeHexagon(game!._id?.toString()!, game!.hexagons[i].toObject());                    
                }
        }
        // game!.hexagons.forEach(async h =>
        //     {
        //         if(h.ownerID == playerEnd?.id)
        //         {
        //             await hs.removeHexagon(game!._id?.toString()!, h.toObject());                    
        //         }
        //     })
        game = await gamesDB.findById(gameID);
        game!.numbOfPlayers! -= 1;
        game!.players = game!.players.filter(p => p._id.toString() != playerEnd!._id.toString());
        
        getSocket.getInstance().of("main").to(gameID).emit("leave_game", playerEnd!._id.toString());

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
        {
            let finmsg = new messageDB();            
            finmsg.createdAt = new Date();
            finmsg.username = 'Server';
            finmsg.text = `The game has finished. User with name ${userWonDoc?.username} and playerID ${playerWonDoc?.id} has won!
            Congratulations!`

            game.messages.push(finmsg);
            await game.save();

            const io = getSocket.getInstance();
            io.of("main").to(gameID).emit("update_game");

           
        }
        

        const io = getSocket.getInstance();
        io.of("main").to(gameID).emit("update_game");
    }


    //async
    

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
    async getResources(game: Game, playerID: string) //collectResources from Mine
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