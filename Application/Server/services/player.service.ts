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
       try
       {    
        
            // if(hexagonSrc.ownerID?._id == playerID)
            // {
                //middleware playerid == userid == tokeind
            // }

            //let player = playersDB.findById(playerID);
            let game = await gamesDB.findById(gameID) as Game;
            if(game == null) {throw new Error("Game with given ID doesn't exist");}
            if (game.turnForPlayerID !== playerID) {throw new Error("Please wait for your turn to play");} //Maybe need to cast 

            // console.log(game.numbOfPlayers);
            //  console.log(hexagonSrcID.toString(), hexagonSrcID, game.hexagons[5]._id, game.hexagons[5]._id?.toHexString());
            //  console.log(game.hexagons[5]._id?.toString() == hexagonSrcID);
            
            let hexagonSrc = game?.hexagons.find(h=> h._id?.toString() == hexagonSrcID) as Army;
            if(hexagonSrc == null) {throw new Error("Source hexagon with given ID doesn't exist");}

            let hexagonDst = game.hexagons.find(h=> h._id?.toString() == hexagonDstID) as any;
            if(hexagonDst == null) {throw new Error("Destination hexagon with given ID doesn't exist");}
            // console.log(hexagonSrc);
            // console.log(hexagonDst); console.log("Radi li");
            

            if (hexagonSrc.type != "Army") {throw new Error("Only Army can make moves");}
            if (hexagonSrc.moves == 0) {throw new Error("Army is out of moves");}
            if(hexagonSrc._id == hexagonDst._id) {throw new Error("Army can't jump to itself");}


            let hs = new HexagonService();
            let areNeighboors = hs.isHexaNeighboor(hexagonSrc, hexagonDst);
            if ( await areNeighboors == false) {throw new Error("Nisu susedni heksagoni");}

        
            
            
           
            let payload: any;
          
           
            if(hexagonDst.type  == 'plain')
            {   
                await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);
             
            }
            else
            {
              if(hexagonDst.ownerID == hexagonSrc.ownerID && (hexagonDst.type == "Mine" || hexagonDst.type == "Castle")) 
              {throw new Error("Ne moze se skakati na svoj rudnik i tvrdjavu");}

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
                }
                else          
                {
                  await hs.removeHexagon(gameID, hexagonSrc);
                }
              }
              else {throw new Error("Nemoguci slucaj");}
            }

            // payload = await this.hexagonRepository.updateSingleHexagon(playerID, gameID, hexagonSrc, points);
            // if(!payload) throw new Error("test")
            // payload = await this.hexagonRepository.updateSingleHexagon(playerID, gameID, hexagonDst, points);
            // if(!payload) throw new Error("test")

            //hexagonSrc.moves -= 1; u repository


            return payload;
        } 
        catch(error) 
        {
            console.log(error);
            return null;
        }

        
    }
    
    async endTurn(playerID: string, gameID: string)
    {
        try
        {    

        } 
        catch(error) 
        {
            console.log(error);
            return null;

        }

    }
}