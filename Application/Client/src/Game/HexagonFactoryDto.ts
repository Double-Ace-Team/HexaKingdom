import { Hexagon } from "../Model/Hexagon";
import { Army } from "../Model/hexagons/Army";
import { Castle } from "../Model/hexagons/Castle";
import { Mine } from "../Model/hexagons/Mine";


export const figureTypes: string[] = ["Army", "Castle", "..."];
//nije factory pattern
export function createHexagon(type:string, data:any, players:any): Hexagon
{
    let figure: Hexagon = new Hexagon(data._id, data.hexaStatus, data.type, "grass", 1, data.q, data.r, data.s);
    if(type == "army")
    {   
        for(let i:number = 0; i < players.length; i++){
            if(players[i]._id == data.ownerID)
            {
                figure = new Army(data._id, data.hexaStatus, data.type, `sword${i+1}`, 1, data.q, data.r, data.s, data.size, data.moves,undefined, data.ownerID);
            }
        }
    }
    else if(type == "castle")
    {
        for(let i:number = 0; i < players.length; i++){
            if(players[i]._id == data.ownerID)
            {
                figure = new Castle(data._id, data.hexaStatus, data.type, `tower${i+1}`, 1, data.q, data.r, data.s, data.size, undefined, data.ownerID);
            }
        }  
    }
    else if(type == "mine")
    {
        for(let i:number = 0; i < players.length; i++){
            if(players[i]._id == data.ownerID)
            {
                figure = new Mine(data._id, data.hexaStatus, data.type, `mine${i+1}`, 1, data.q, data.r, data.s, data.revenue, undefined, data.ownerID);
            }
        }  
    }

    return figure;
}