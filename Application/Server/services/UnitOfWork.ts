import { PlayerService } from "./player.service";
import { UserService } from "./user.service";

export class UnitOfWOrk
{   
    players: PlayerService;
    users: UserService;

    constructor()
    {
        this.players = new PlayerService();
        this.users = new UserService();
    }
}