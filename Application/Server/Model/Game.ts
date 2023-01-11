import { Hexagon } from "./Hexagon";
import { IModel } from "./IModel";
import { Player } from "./Player";
import { User } from "./User";

export interface Game extends IModel
{
    players: Array<Player>;
    numbOfPlayers: number;
    hexagons: Array<Hexagon>;
    turnNumber: number;
    isFinished: boolean;
    playerWonID: string;
    playerCreatedID: string;
    turnForPlayerID: string; //playerID for turn
    
}