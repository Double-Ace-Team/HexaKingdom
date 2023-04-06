import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { gamesDB } from "../db/db-model";

export class HexagonRepository
{
    async updateSingleHexagon(playerObj: Player, gameID: any,hexagon: Hexagon, points: number)
    {

        try {
            
                const game = await gamesDB.findOneAndUpdate
                (
                    { 
                        "_id": gameID, "hexagons._id": hexagon._id 
                    },
                    { 
                        "$set": 
                        {
                            "hexagons.$.hexaStatus": hexaStatus.captured,
                            "hexagons.$.points": points,
                            "hexagons.$.ownerID": playerObj
                        }
                    }
                );
                console.log(game);
            return game

        } catch (error) {

            console.log(error);

        }

        return null

    }
}