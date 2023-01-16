import { Hexagon } from "./Hexagon";
import { IModel } from "./IModel";
import { Player } from "./Player";
import { User } from "./User";

export default interface Game extends IModel
{
    players: Array<Player>;
    numbOfPlayers: number;
    hexagons: Array<Hexagon>;
    turnNumber: number;
    isFinished: boolean;
    isStarted: boolean;
    playerWonID: string;
    userCreatedID: string;
    turnForPlayerID: string; //playerID for turn
    createdAt: Date;
    
}