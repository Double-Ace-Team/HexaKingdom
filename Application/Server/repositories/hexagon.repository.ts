import mongoose from "mongoose";
import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { Army } from "../Model/hexagons/Army";
import { gamesDB } from "../db/db-model";

export class HexagonRepository
{
    async updateSingleHexagon(playerID: string, gameID: string,hexagon: Army, points: number)
    {

        try {
            console.log(hexagon._id)
            const game = await gamesDB.findOneAndUpdate
            (
                { 
                    "_id": new mongoose.Types.ObjectId(gameID), "hexagons": {"$elemMatch" : {"_id": hexagon._id}}
                },  
                { 
                    "$set": 
                    {
                        //"hexagons.$.hexaStatus": hexaStatus.captured,
                        //"hexagons.$.ownerID": playerObj
                        "hexagons.$.q": hexagon.q,
                        "hexagons.$.s": hexagon.s,
                        "hexagons.$.r": hexagon.r,

                    }
                }
            );
            console.log(game)

            return game
        } catch (error) {

            console.log(error);

        }

        return null

    }



}