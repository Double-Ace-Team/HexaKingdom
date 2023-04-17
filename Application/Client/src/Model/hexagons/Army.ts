import { Hexagon } from "../Hexagon";
import { Player } from "../Player";


export class Army extends Hexagon
{
    size: number;
    moves: number;
    constructor(_id: string, hexaStatus: number, 
        type: string,
        img: string,
        q: number,
        r: number,
        s: number,
        size: number,
        moves: number,
        points?: number,
        ownerID?: Player
    ){
        super(_id, hexaStatus, type, img, q, r, s, points, ownerID)
        this.size = size;
        this.moves = moves;
    }
}