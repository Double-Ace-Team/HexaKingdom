import { number, object } from "zod";
import { Hexagon } from "../Model/Hexagon";
import { BaseService } from "./base.service";
import { Army } from "../Model/hexagons/Army";
import { armiesDB, gamesDB, plainsDB, playersDB } from "../db/db-model";


export class HexagonService extends BaseService
{
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

