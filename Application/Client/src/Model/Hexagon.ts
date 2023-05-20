import { IModel } from "./IModel";
import { Player } from "./Player";

export class Hexagon extends IModel
{ 
    hexaStatus: hexaStatus;
    ownerID?: Player;
    points?: number; 
    type: string;
    img: string;
    opacity: number;
    q: number;
    r: number;
    s: number;

    constructor(_id: string, hexaStatus: hexaStatus, 
        type: string,
        img: string,
        opacity: number,
        q: number,
        r: number,
        s: number,
        points?: number,
        ownerID?: Player
    ){
        super(_id)
        this.hexaStatus = hexaStatus;
        this.type = type;
        this.img = img;
        this.opacity = opacity;
        this.q = q;
        this.r = r;
        this.s = s;
        this.points = points;
        this.ownerID=  ownerID;
    }

}

export enum hexaStatus
{
    neutral = 0,
    captured = 1,
}