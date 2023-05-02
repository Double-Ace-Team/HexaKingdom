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

    async makeMove(playerID: string, gameID: string, hexagonSrc: Army, hexagonDst: Hexagon, points: number)
    {
       try
       {    
            // if(hexagonSrc.ownerID?._id == playerID)
            // {
                //middleware playerid == userid == tokeind
            // }

            let player = playersDB.findById(playerID);
            let game = gamesDB.findById(gameID) as unknown as Game;

            if (game.turnForPlayerID !== playerID) {throw new Error("Nisi na potezu");}

            //if (hexagonSrc.type != "Army") {throw new Error("Samo vojska moze da pravi poteze");}
            if (hexagonSrc.moves == 0) {throw new Error("Vojska nema vise slobodnih koraka");}
            


            let hs = new HexagonService();
            let areNeighboors = hs.isHexaNeighboor(hexagonSrc, hexagonDst);
            if ( areNeighboors == false) {throw new Error("Nisu susedni heksagoni");}

            //ovo je vise za front-end?
            if(hexagonSrc == hexagonDst) {throw new Error("Ne moze se skakati na trenutno polje");}
            
           
            let payload: any;
          
           

            //test ^ if success
           // potreban izmena/ nema razmene koordinata nego se kreira novi hexagon tipa plain na staro mesto
            
            if(hexagonDst.hexaStatus == hexaStatus.neutral) //ili hexatype == plain
            {   
                let q = hexagonSrc.q;
                let s = hexagonSrc.s;
                let r = hexagonSrc.r;
                hexagonSrc.q = hexagonDst.q;
                hexagonSrc.s = hexagonDst.s;
                hexagonSrc.r = hexagonDst.r;
                hexagonDst.q = q;
                hexagonDst.s = s;
                hexagonDst.r = r;
             
            }
            else(hexagonDst.hexaStatus == hexaStatus.captured)
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

            payload = await this.hexagonRepository.updateSingleHexagon(playerID, gameID, hexagonSrc, points);
            if(!payload) throw new Error("test")
            payload = await this.hexagonRepository.updateSingleHexagon(playerID, gameID, hexagonDst, points);
            if(!payload) throw new Error("test")

            hexagonSrc.moves -= 1;


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