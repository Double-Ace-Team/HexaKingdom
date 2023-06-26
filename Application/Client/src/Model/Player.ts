import  Game  from "./Game";
import { Hexagon } from "./Hexagon";
import { IModel } from "./IModel";
import { User } from "./User";

export class Player extends IModel
{
    user?: User;
    game?: Game; //gameID: s tring?
    //capturedHexagons: Array<Hexagon>;
    resources: number;
    color: String;
    playerStatus: PlayerStatus;

    constructor(_id: string, resources: number, playerStatus: PlayerStatus, user: User, game: Game, color: String)
    {
        super(_id);
        this.resources= resources;
        this.playerStatus = playerStatus;
        this.user = user;
        this.game = game;
        this.color = color;
    }

}

export enum PlayerStatus 
{
    Active = 0,
    Destroyed = 1,
    Won = 2,
    Left = 3,
    AFK = 4,
}