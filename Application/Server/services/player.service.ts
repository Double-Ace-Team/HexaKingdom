import { playersDB } from "../db/db-model";
import { Player } from "../Model/Player";
import { BaseService } from "./base.service";

export class PlayerService extends BaseService
{
    async create(player: Player)
    {
        const newPlayer = new playersDB(player);

        try {

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
    
}