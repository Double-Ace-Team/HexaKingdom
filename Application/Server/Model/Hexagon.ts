import { Game } from "./Game";
import { IModel } from "./IModel";
import { Player } from "./Player";

export interface Hexagon extends IModel
{ 
    hexaStatus: hexaStatus;
    ownerID?: Player;
    points?: number; 
    type: string;
    q: number,
    r: number,
    s: number,
}

export enum hexaStatus
{
    neutral = 0,
    captured = 1,
}