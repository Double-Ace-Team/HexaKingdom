import { Hexagon } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { Army } from "../Model/hexagons/Army";
import { Castle } from "../Model/hexagons/Castle";
import { Mine } from "../Model/hexagons/Mine";


export const figureTypes: string[] = ["Army", "Castle", "..."];
const playerColor: string[] = ["red", "blue", "green", "yellow"];

//nije factory pattern
export function createHexagon(type:string, data:any, players:Player[]): Hexagon
{
    let figure: Hexagon = new Hexagon(data._id, data.hexaStatus, data.type, "grass", 1, data.q, data.r, data.s);
    
    if(type == "army")
    {   
        for(let i:number = 0; i < players.length; i++){
            if(players[i]._id == data.ownerID)
            {
                let index: number = playerColor.findIndex((element: string) => element == players[i].color)
                figure = new Army(data._id, data.hexaStatus, data.type, `sword${index+1}`, 1, data.q, data.r, data.s, data.size, data.moves,undefined, data.ownerID);
            }
        }
    }
    else if(type == "castle")
    {
        for(let i:number = 0; i < players.length; i++){
            if(players[i]._id == data.ownerID)
            {
                let index: number = playerColor.findIndex((element: string) => element == players[i].color)
                figure = new Castle(data._id, data.hexaStatus, data.type, `tower${index+1}`, 1, data.q, data.r, data.s, data.size, undefined, data.ownerID);
            }
        }  
    }
    else if(type == "mine")
    {
        for(let i:number = 0; i < players.length; i++){
            if(players[i]._id == data.ownerID)
            {
                let index: number = playerColor.findIndex((element: string) => element == players[i].color)
                figure = new Mine(data._id, data.hexaStatus, data.type, `mine${index+1}`, 1, data.q, data.r, data.s, data.revenue, undefined, data.ownerID);
            }
        }  
    }

    return figure;
}