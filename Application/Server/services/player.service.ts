import { playersDB, usersDB } from "../db/db-model";
import { Player } from "../Model/Player";
import { BaseService } from "./base.service";

export class PlayerService extends BaseService
{
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
    
}