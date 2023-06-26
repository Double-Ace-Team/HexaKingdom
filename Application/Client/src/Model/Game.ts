import { Hexagon } from "./Hexagon";
import { IModel } from "./IModel";
import { Player } from "./Player";
import { User } from "./User";
import { Message } from "./Message";
export default class Game extends IModel
{
    players: Array<Player>;
    numbOfPlayers: number;
    hexagons: Array<Hexagon>;
    messages: Array<Message>;
    turnNumber: number;
    isFinished: boolean;
    isStarted: boolean;
    playerWonID: string;
    userCreatedID: string;
    turnForPlayerID: string; //playerID for turn
    createdAt: Date;

    
    constructor(_id: string, players: Array<Player>, numbOfPlayers: number, 
                hexagons: Array<Hexagon>, turnNumber: number,
                isFinished: boolean, isStarted: boolean,
                playerWonID: string, userCreatedID: string,
                turnForPlayerID: string, createdAt: Date, messages: Array<Message>, 
    )
    {
        super(_id);
        this.players = players
        this.numbOfPlayers = numbOfPlayers;
        this.hexagons = hexagons;
        this.turnNumber =  turnNumber;
        this.isFinished = isFinished;
        this.isStarted = isStarted;
        this.playerWonID = playerWonID;
        this.userCreatedID = userCreatedID;
        this.turnForPlayerID = turnForPlayerID;
        this.createdAt = createdAt;
        this.messages = messages;
    }
}