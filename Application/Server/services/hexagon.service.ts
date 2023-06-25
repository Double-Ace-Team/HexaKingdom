import { number, object } from "zod";
import { Hexagon } from "../Model/Hexagon";
import { BaseService } from "./base.service";
import { Army } from "../Model/hexagons/Army";
import { armiesDB, gamesDB, plainsDB, playersDB } from "../db/db-model";
import getSocket from "../socket";
import { PlayerService } from "./player.service";
import ApplicationError from "../utils/error/application.error";

export class HexagonService extends BaseService
{
    ps: PlayerService = new PlayerService();
    // hs: HexagonService;

    // constructor()
    // {
    //     super();
    //     this.hs = new HexagonService();
    // }
    isHexaNeighboor(hexaSrc: Hexagon, hexaDst: Hexagon) //async?
    {
        let hexas: Hexa[] = new Array<Hexa>;
        hexas.push(new Hexa(hexaSrc.q + 1, hexaSrc.r + 0, hexaSrc.s - 1));
        hexas.push(new Hexa(hexaSrc.q + 1, hexaSrc.r - 1, hexaSrc.s + 0 ));
        hexas.push(new Hexa(hexaSrc.q + 0, hexaSrc.r - 1, hexaSrc.s + 1 ));
        hexas.push(new Hexa(hexaSrc.q + 0, hexaSrc.r + 1, hexaSrc.s - 1 ));
        hexas.push(new Hexa(hexaSrc.q - 1, hexaSrc.r + 0 , hexaSrc.s + 1 ));
        hexas.push(new Hexa(hexaSrc.q - 1, hexaSrc.r + 1, hexaSrc.s + 0 ));

        let hexaTarget: Hexa = new Hexa(hexaDst.q, hexaDst.r, hexaDst.s);
        let flag: boolean = false;
        hexas.forEach(h => {
            if(JSON.stringify(h) === JSON.stringify(hexaTarget))
            {
                flag = true;
            }
        });

        return flag
    }

    async swapCoordinates(gameID: string, hexaSrc: Army, hexaDst: Hexagon)
    {
    
                let q = hexaSrc.q; 
                let s = hexaSrc.s;
                let r = hexaSrc.r;
                
                let game = await gamesDB.findById(gameID);

                if(game == null) throw Error("Igra ne postoji") 

                //Kada je f-ja async, OBAVEZNO AWAIT!
               
                game?.hexagons.forEach((h : any) => {

                    if(h.q == hexaSrc.q && h.s == hexaSrc.s && h.r == hexaSrc.r)//if(h._id.equals(hexaSrc._id))
                    {
                        if(h.toObject().moves < 1)
                            {throw new Error("No more moves left");}
                        if(h.type == 'army' ) {throw new Error("Moves only with army hexagons");}
                        let copyArmy = new armiesDB({size: h.size, moves: h.toObject().moves - 1,
                             hexaStatus: h.hexaStatus, ownerID: h.ownerID, playerStatus: h.playerStatus, points: h.points,
                              q: hexaDst.q, r: hexaDst.r, s: hexaDst.s})
                        
                        game?.hexagons.remove(h)
                        game?.hexagons.push(copyArmy)
                    }
                })
                
               
                game?.hexagons.remove({_id: hexaDst._id});
                //game?.hexagons = game?.hexagons.filter(h => h._id != hexaDst._id);
                let newPlain: any = new plainsDB({hexaStatus: 0, ownerID:"", points: 0, q: q, r: r, s: s});
                game?.hexagons.push(newPlain)               

                
                // game?.markModified('hexagons');
                const result = await game?.save();
                return game;
            
    }

    async removeHexagon(gameID: string, hexagon: Hexagon)
    {
        let q = hexagon.q;
        let r = hexagon.r;
        let s = hexagon.s;

        let game = await gamesDB.findById(gameID);
        game?.hexagons.remove({_id: hexagon._id});
        let newPlain: any = new plainsDB({hexaStatus: 0, ownerID:"", points: 0, q: q, r: r, s: s});
        game?.hexagons.push(newPlain);
        await game?.save();
    }


    async setResources(gameID: string, playerID: string, hexagonID: string, resources: number)
    {
        let game = await gamesDB.findById(gameID);
        let player = await playersDB.findById(playerID);
        let hexagon = game?.hexagons.find(h => h._id?.toString() == hexagonID) as any; 
        let ind: number = game!.hexagons.findIndex(h => h._id!.toString() == hexagonID);

        hexagon = JSON.parse(JSON.stringify(hexagon)); 

        this.ps.checksValidation(game!.toObject(), player!.toObject(), hexagon);
        if(resources < 0) {throw new Error("Negative value for resources not allowed");}

        if(hexagon.ownerID.toString() != player!._id?.toString()) {throw new Error("Source hexagon with given ID doesn't belong to player");}
        

        if(hexagon.type == 'army' || hexagon.type == 'castle') 
        { game?.hexagons[ind].$set('size', hexagon.size + resources);}
        else if(hexagon.type == 'mine') 
        {game?.hexagons[ind].$set('revenue', hexagon.revenue + resources);}
        else 
        {throw new Error("Can't place resources on plain hexagon or unknown error");}

        player!.resources! -= resources;
        await game?.save();
        await player?.save();

        const io = getSocket.getInstance();
        io.of("main").to(gameID).emit("update_game");
                                
    }
//2 res = army
    async createNewArmy(gameID: string, playerID: string)
    {
        let gameDoc = await gamesDB.findById(gameID);
        let playerDoc = await playersDB.findById(playerID);
        //console.log(gameDoc, playerDoc);
        this.ps.checksValidation(gameDoc!.toObject(), playerDoc!.toObject(), 'redundant parameter');
        //Nuthin
        if (gameDoc!.turnForPlayerID?.toString() != playerDoc!._id!.toString()) {throw new Error("Please wait for your turn to play");}

        if(playerDoc?.resources! < 2) {throw new ApplicationError("Not enough resources to create army");}

        let castleDoc = gameDoc?.hexagons.find(h => h.ownerID == playerDoc?.id && h.toObject().type == 'castle');
        if (castleDoc == null) {throw new Error("Can't find players castle or player is destroyed");}
        let hs = new HexagonService();

        let flag = false;

        for (let h of gameDoc!.hexagons) //Typescript: can only use procedural statements(continue, break) in for loop, not in for-each loop.
        {
            

            if (hs.isHexaNeighboor(castleDoc!.toObject(), h.toObject()) && h.toObject().type == 'plain') 
            {
                console.log(h, h.toObject().type);

                gameDoc!.hexagons.push(new armiesDB({size: 10, moves: 3, hexaStatus: 1, ownerID: playerDoc?.id,
                     playerStatus: 0, points: 0, q: h.q, r: h.r, s: h.s,}));


                gameDoc?.hexagons.remove({_id: h._id});
                flag = true;
                break;
            }
         }

         if(flag == false) {throw new Error("There are no available plain hexagons neighbooring the player's castle");}

         playerDoc!.resources! -= 2;

         await gameDoc?.save();
         await playerDoc?.save();

        const io = getSocket.getInstance();
        io.of("main").to(gameID).emit("update_game");

    }
}



class Hexa
{
    q: number;
    r: number;
    s: number;

    constructor(q: number,s: number,r: number)
    {
        this.q = q;
        this.r = r;
        this.s = s;
    }
}

