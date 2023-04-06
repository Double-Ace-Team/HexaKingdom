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

    async makeMove(playerObj: Player, gameID: any,hexagon: Hexagon, points: number)
    {
       try
       {
           
            let payload = null;
            if(hexagon.hexaStatus == hexaStatus.neutral)
            {
               payload = await this.hexagonRepository.updateSingleHexagon(playerObj, gameID, hexagon, points);
            }
            else(hexagon.hexaStatus == hexaStatus.captured)
            {
                if(hexagon.ownerID == playerObj._id)
                {

                }
                else(hexagon.ownerID != playerObj._id)
                {

                }
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