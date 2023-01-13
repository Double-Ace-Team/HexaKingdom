import { GameService } from "./game.service";
import { PlayerService } from "./player.service";
import { UserService } from "./user.service";

export class UnitOfWOrk
{   
    players: PlayerService;
    users: UserService;
    games: GameService;

    constructor()
    {
        this.players = new PlayerService();
        this.users = new UserService();
        this.games = new GameService();
    }
}