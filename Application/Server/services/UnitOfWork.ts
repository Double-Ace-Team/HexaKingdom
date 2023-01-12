import { PlayerService } from "./player.service";

export class UnitOfWOrk
{   
    players: PlayerService;

    constructor()
    {
        this.players = new PlayerService()
    }
}