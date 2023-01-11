import { Game } from "./Game";
import { IModel } from "./IModel";
import { Player } from "./Player";

export interface Hexagon extends IModel
{ //
    hexaStatus: hexaStatus;
    game: Game;
    ownerID?: Player;
    points?: number;

}

enum hexaStatus
{
    neutral = 0,
    captured = 1,
}