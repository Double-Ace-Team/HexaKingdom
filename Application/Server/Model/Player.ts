import { Game } from "./Game";
import { Hexagon } from "./Hexagon";
import { IModel } from "./IModel";
import { User } from "./User";

export interface Player extends IModel
{
    user?: User;
    game?: Game; //gameID: s tring?
    //capturedHexagons: Array<Hexagon>;
    resources: number;
    color: string;
    playerStatus: PlayerStatus;
}

export enum PlayerStatus 
{
    Active = 0,
    Destroyed = 1,
    Won = 2,
    Left = 3,
    AFK = 4,
}