import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { Army } from "../Model/hexagons/Army";
import { gamesDB } from "../db/db-model";

export class HexagonRepository
{
    async updateSingleHexagon(playerID: string, gameID: string,hexagon: Army, points: number)
    {

        try {
            console.log(250, hexagon.moves, hexagon);
            const game = await gamesDB.updateOne
            (
                { 
                    "_id": gameID, "hexagons._id": hexagon._id
                },  
                {
                    "__t": "army"
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
                        "hexagons.$.moves": 50

                    }
                }
            );
            return game

        } catch (error) {

            console.log(error);

        }

        return null

    }



}