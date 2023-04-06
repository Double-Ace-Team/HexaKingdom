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
           // const gameFind = await gamesDB.findById(gameID);
            // const findPlayer = await playersDB.findById(playerObj._id);

            // gameFind!.hexagons.forEach(hexa => 
            //     {
            //         if(hexa.id == hexagon._id)
            //         {
            //             hexa.hexaStatus = hexaStatus.captured;
            //             hexa.points = points;
            //             hexa.ownerID = findPlayer?.id;
            //         }
            //     })
            // const res = await gamesDB.updateOne({"_id": gameID}, {$set: {"hexagons": gameFind?.hexagons}});
            // console.log(res);
        // let userData = {productCode: "4pf"}
        // let dataToBeUpdated = {claims: ["abc", "def"]}
        // ProductModel.findOneAndUpdate({"products.productCode": userData.productCode}, {$set: {"products.$": dataToBeUpdated}})
        // const res = await gamesDB.updateOne({"_id": gameID}, {$set: {"turnNumber": 350}});
        // console.log(res);
        // const map = gameFind?.hexagons;
        // map?.forEach(p => 
        //     {
        //         if(p.id == hexagon._id)
        //         {
        //              p.hexaStatus = hexaStatus.captured;
        //             p.points = points; //!
        //         }
        //     })
        //     let dataToBeUpdated = {hexagons: map};
        //    const a = await gamesDB.updateOne(
        //             { "_id": gameID},
        //             { 
        //                 $set: {
        //                     "games.$": dataToBeUpdated
        //                 }
        //             },
        //         );
        //         console.log(a);
            // 
            // gameFind!.hexagons = undefined;
            //const map = gameFind?.hexagons.filter(h => h.id == hexagon._id);
            // const array = gameFind?.hexagons;
           
            // // gameFind?.hexagons.map(p => map, map);
            // console.log(gameFind);
            // await gameFind?.updateOne();

            // const aa = await gamesDB.updateOne(
            //     {
            //         _id: gameID, 
            //         hexagons: {
            //             $elemMatch: {
            //                 _id: hexagon._id
            //             }
            //         }
            //     }, {
            //         $set: {
            //             "hexagons.$[outer].points": points
            //         }
            //     }, {
            //         "arrayFilters": 
            //         [
            //             {"outer._id": hexagon._id}
            //         ]
            //     });
            // const res = await gamesDB.updateOne({"hexagons._id": hexagon._id}, {$set: {"hexagons.$.hexaStatus": hexaStatus.captured,
            //                                                                                             "hexagons.$.ownerID": playerObj,
            //                                                                                             "hexagons.$.points": points }});
            // 
        // const res = await gamesDB.updateOne({"_id": gameID}, {$set: {"hexagons.${h}.hexaStatus": hexaStatus.captured,
        //                                                                                             //     "hexagons.$.ownerID": playerObj,
        //                                                                                             //     "hexagons.$.points": points }
        //                                                                                             // 
        //                                                                     }}, {"arrayFilters": [{"h._id": hexagon._id}]});
            // console.log(res);                                                                                             
            //  const res = gameFind?.hexagons.filter(h => h.id == hexagon._id)
            //                                .map(h => {h.points = points, h.hexaStatus = hexaStatus.captured});
            
            // gameFind?.save();
            // hexagon.hexaStatus = hexaStatus.captured;
            // hexagon.ownerID = playerObj;
            // hexagon.points = points; //!
            
            // const playerF = await playersDB.findByIdAndUpdate(playerObj);
            // const hexaFind = await plainsDB.findById(hexagon._id);
            // const hexares = await plainsDB.findByIdAndUpdate(hexagon._id); //ne moze ovako
          
           
            
            // const res = await gamesDB.updateOne({"_id": gameID}, {$set: {"isFinished": false}});
            
            
          
            //console.log(playerF);
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