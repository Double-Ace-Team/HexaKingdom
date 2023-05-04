import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { gamesDB } from "../db/db-model";

export class HexagonRepository
{
    async updateSingleHexagon(playerID: string, gameID: string,hexagon: Hexagon, points: number)
    {

        try {
            console.log(gameID)
            console.log(hexagon)

            const game = await gamesDB.findOneAndUpdate
            (
                { 
                    "_id": gameID, "hexagons._id": hexagon._id 
                },  
                { 
                    "$set": 
                    {
                        //"hexagons.$.hexaStatus": hexaStatus.captured,
                        //"hexagons.$.points": points,
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