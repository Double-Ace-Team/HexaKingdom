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

    async makeMove(gameID: string, hexagonSrcID: string, hexagonDstID: string, points: number)
    {
       try
       {    
        
            // if(hexagonSrc.ownerID?._id == playerID)
            // {
                //middleware playerid == userid == tokeind
            // }

            //let player = playersDB.findById(playerID);
            let game = await gamesDB.findById(gameID) as Game;
            // console.log(game.numbOfPlayers);
            //  console.log(hexagonSrcID.toString(), hexagonSrcID, game.hexagons[5]._id, game.hexagons[5]._id?.toHexString());
            //  console.log(game.hexagons[5]._id?.toString() == hexagonSrcID);
            
            let hexagonSrc = game?.hexagons.find(h=> h._id?.toString() == hexagonSrcID) as Army;
            let hexagonDst = game.hexagons.find(h=> h._id?.toString() == hexagonDstID) as any;
            console.log(hexagonSrc);
            console.log(hexagonDst); 
            console.log("Radi li");
            //if (game.turnForPlayerID !== playerID) {throw new Error("Nisi na potezu");}
            //if (hexagonSrc.type != "Army") {throw new Error("Samo vojska moze da pravi poteze");}
            if (hexagonSrc.moves == 0) {throw new Error("Vojska nema vise slobodnih koraka");}
            


            let hs = new HexagonService();
            let areNeighboors = hs.isHexaNeighboor(hexagonSrc, hexagonDst);
            if ( await areNeighboors == false) {throw new Error("Nisu susedni heksagoni");}

            //ovo je vise za front-end?
            if(hexagonSrc == hexagonDst) {throw new Error("Ne moze se skakati na trenutno polje");}
            
           
            let payload: any;
          
           

            //test ^ if success
           // potreban izmena/ nema razmene koordinata nego se kreira novi hexagon tipa plain na staro mesto
            
            if(hexagonDst.hexaStatus == 0) //ili hexatype == plain
            {   
                await hs.swapCoordinates(gameID, hexagonSrc, hexagonDst);
             
            }
            else
            {
              if(hexagonDst.ownerID == hexagonSrc.ownerID && (hexagonDst.type == "Mine" || hexagonDst.type == "Castle")) 
              {throw new Error("Ne moze se skakati na svoj rudnik i tvrdjavu");}

              //3 slucaja: vojska polje, rudnik polje, tvrdjava polje
              if(hexagonDst.type == "Mine")
              {

              }
              else if (hexagonDst.type == "Army")
              {

              }
              else if (hexagonDst.type == "Castle")
              {

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