import { ObjectId } from "mongoose";
import { playersDB, usersDB, plainsDB, gamesDB } from "../db/db-model";
import { Game } from "../Model/Game";
import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player } from "../Model/Player";
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

        try {
            const newPlayer = new playersDB(player);

            const user = await usersDB.findById(userID);

            newPlayer.user = user?._id;
            
            const result = await newPlayer.save();
            
            return result;

        } catch (error) {
            console.log(error);
        }

        return null
    }
    
    async get(playerID: string)
    {

        try {

            const player = await playersDB.findById(playerID);

            return player

        } catch (error) {

            console.log(error);
            return null

        }

    }
    
    async makeMove(gameID: string, playerID: string, hexagonSrcID: string, hexagonDstID: string)
    {
      
        
            // if(hexagonSrc.ownerID?._id == playerID)
            // {
                //middleware playerid == userid == tokeind
            // }

           
            let game = await gamesDB.findById(gameID) as Game;
            if(game == null) {throw new Error("Game with given ID doesn't exist");}
        
            if (game.turnForPlayerID.toString() != playerID) {throw new Error("Please wait for your turn to play");}

            let hexagonSrc = game?.hexagons.find(h=> h._id?.toString() == hexagonSrcID) as Army;
            if(hexagonSrc == null) {throw new Error("Source hexagon with given ID doesn't exist");}

            let hexagonDst = game.hexagons.find(h=> h._id?.toString() == hexagonDstID) as any;
            if(hexagonDst == null) {throw new Error("Destination hexagon with given ID doesn't exist");}
          
            if(hexagonSrc._id == hexagonDst._id) {throw new Error("Army can't jump to itself");}

            let hs = new HexagonService();
            let areNeighboors = hs.isHexaNeighboor(hexagonSrc, hexagonDst);
            if ( await areNeighboors == false) {throw new Error("Hexagons are not neighboors");}

            let payload: any;
          
           
            if(hexagonDst.toObject().type  == 'plain')
            {   
                await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);
             
            }
            else
            {
              if(hexagonDst.ownerID == hexagonSrc.ownerID && (hexagonDst.type == "Mine" || hexagonDst.type == "Castle")) 
              {throw new Error("Can't move on your mine or your castle");}

              //3 slucaja: vojska polje, rudnik polje, tvrdjava polje
              //logic for points losing, calculation...
              if(hexagonDst.type == "Mine")
              {
                await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst); //later: if mine has defence points, calculate army vs mine point with mb probability
              }
              else if (hexagonDst.type == "Army")
              {
                if (Math.random() < 1/2) 
                {
                    await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst); //later: creating new Army
                }
                else          
                {
                  await hs.removeHexagon(gameID, hexagonSrc);
                }
              }
              else if (hexagonDst.type == "Castle")
              {
                if (Math.random() < 1/4) 
                {
                    await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst); //later: creating new Army
                    //playerStatus=destroyed, game.players izbaciti?, game.players.foreach(players/players.status =destroyed) ->
                    //->  ako svi ostali sem jednog imaju ovaj status game.PlayerWonID = ""
                    //obrisati vojsku, rudnik, i ostala polja ako imaju automatski
                    //socket.io sve da obavesti
                    this.eliminatePlayer();
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

    async eliminatePlayer()
    {
        
    }

    async endTurn(playerID: string, gameID: string)
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
}