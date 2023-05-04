import { number } from "zod";
import { Hexagon } from "../Model/Hexagon";
import { BaseService } from "./base.service";
import { HexagonRepository } from "../repositories/hexagon.repository";
import { gamesDB, plainsDB } from "../db/db-model";
import { Game } from "../Model/Game";
import {Plain } from "../Model/hexagons/Plain";
import { Army } from "../Model/hexagons/Army";
import { set } from "mongoose";
import { armySchema } from "../db/schema/Hexagons/ArmySchema";
import { hexaSchema } from "../db/schema/HexagonSchema";

export class HexagonService extends BaseService
{
    // hs: HexagonService;

    // constructor()
    // {
    //     super();
    //     this.hs = new HexagonService();
    // }
    async isHexaNeighboor(hexaSrc: Hexagon, hexaDst: Hexagon) //async?
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
                hexaSrc.q = hexaDst.q;
                hexaSrc.s = hexaDst.s;
                hexaSrc.r = hexaDst.r;

                let hr = new HexagonRepository();
                let game = await gamesDB.findById(gameID);
                //Kada je f-ja async, OBAVEZNO AWAIT!
               // hexaSrc.moves = hexaSrc.moves - 1;
               console.log(hexaSrc);
                await hr.updateSingleHexagon("null", gameID, hexaSrc, 0);
                let hexas = game!.hexagons as unknown as Army[];
                hexas.forEach(h => {
                    if(h._id == hexaSrc._id)
                    {
                        h.q = hexaDst.q;
                        h.r = hexaDst.r;
                        h.s = hexaDst.s;
                        h.moves -= 1;
                    }
                })
                 game!.hexagons = hexas;
                let indexArmy = game?.hexagons.findIndex(h => h.id === hexaSrc._id) as number;
                let army = game?.hexagons.filter(h => h.id == hexaSrc._id) as unknown as Army;
                console.log(army);
                army.q = hexaDst.q;
                army.r = hexaDst.r;
                army.s = hexaDst.s;
                army.moves -= 1;

                game!.hexagons[indexArmy] = army;
                
               
                game?.hexagons.remove({_id: hexaDst._id});
                //game?.hexagons = game?.hexagons.filter(h => h._id != hexaDst._id);
                let newPlain: any = new plainsDB({hexaStatus: 0, ownerID:"", points: 0, q: q, r: r, s: s});
               

                await game?.save();

                return game;
            
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

