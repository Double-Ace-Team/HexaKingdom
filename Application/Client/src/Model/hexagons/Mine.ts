import { Hexagon } from "../Hexagon";
import { Player } from "../Player";


export class Mine extends Hexagon
{
    revenue: number;

    constructor(_id: string, hexaStatus: number, 
        type: string,
        img: string,
        opacity: number,
        q: number,
        r: number,
        s: number,
        revenue: number,
        points?: number,
        ownerID?: Player
    ){
        super(_id, hexaStatus, type, img, opacity, q, r, s, points, ownerID)
        this.revenue = revenue;
    }
}