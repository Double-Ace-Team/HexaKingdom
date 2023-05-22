import { Hexagon } from "../Hexagon";
import { Player } from "../Player";


export class Castle extends Hexagon
{
    size: number;
    constructor(_id: string, hexaStatus: number, 
        type: string,
        img: string,
        opacity: number,
        q: number,
        r: number,
        s: number,
        size: number,
        points?: number,
        ownerID?: Player
    ){
        super(_id, hexaStatus, type, img, opacity, q, r, s, points, ownerID)
        this.size = size;
    }
}