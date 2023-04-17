import { ObjectId } from "mongoose";
import { playersDB, usersDB, plainsDB, gamesDB } from "../db/db-model";
import { Game } from "../Model/Game";
import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { BaseService } from "./base.service";
import { HexagonRepository } from "../repositories/hexagon.repository";

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

        }

        return null

    }

    async makeMove(playerID: string, gameID: string, hexagonSrc: Hexagon, hexagonDst: Hexagon, points: number)
    {
       try
       {    
            // if(hexagonSrc.ownerID?._id == playerID)
            // {
                //middleware playerid == userid == tokeind
            // }
           
            let payload: any;
            
            let q = hexagonSrc.q;
            let s = hexagonSrc.s;
            let r = hexagonSrc.r;
            hexagonSrc.q = hexagonDst.q;
            hexagonSrc.s = hexagonDst.s;
            hexagonSrc.r = hexagonDst.r;
            hexagonDst.q = q;
            hexagonDst.s = s;
            hexagonDst.r = r;
            payload = await this.hexagonRepository.updateSingleHexagon(playerID, gameID, hexagonSrc, points);
            if(!payload) throw new Error("test")
            payload = await this.hexagonRepository.updateSingleHexagon(playerID, gameID, hexagonDst, points);
            if(!payload) throw new Error("test")

            //test ^ if success
           // potreban izmena/ nema razmene koordinata nego se kreira novi hexagon tipa plain na staro mesto

            if(hexagonDst.hexaStatus == hexaStatus.neutral)
            {   

            }
            else(hexagonDst.hexaStatus == hexaStatus.captured)
            {
                // if(hexagon.ownerID == playerObj._id)
                // {

                // }
                // else(hexagon.ownerID != playerObj._id)
                // {

                // }
            }
            return payload;
        } 
        catch(error) 
        {
            console.log(error);
        }

        return null
    }
    
}