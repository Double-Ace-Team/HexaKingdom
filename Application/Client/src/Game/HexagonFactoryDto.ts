import { Hexagon } from "../Model/Hexagon";
import { Army } from "../Model/hexagons/Army";


export const figureTypes: string[] = ["Army", "Castle", "..."];
//nije factory pattern
export function createHexagon(type:string, data:any): Hexagon
{
    let figure: Hexagon = new Hexagon(data._id, data.hexaStatus, data.type, "pat-1", 1, data.q, data.r, data.s);
    if(type == "army")
    {
        figure = new Army(data._id, data.hexaStatus, data.type, "pat-2", 1, data.q, data.r, data.s, data.number, data.moves);
    }

    return figure;
}