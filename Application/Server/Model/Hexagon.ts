import { Game } from "./Game";
import { IModel } from "./IModel";
import { Player } from "./Player";

export interface Hexagon extends IModel
{ 
    hexaType: String,
    hexaStatus: hexaStatus;
    ownerID?: Player;
    points?: number;

}

export enum hexaStatus
{
    neutral = 0,
    captured = 1,
}