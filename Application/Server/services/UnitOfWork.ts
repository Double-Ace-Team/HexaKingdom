import { hexaSchema } from "../db/schema/HexagonSchema";
import { GameService } from "./game.service";
import { HexagonService } from "./hexagon.service";
import { PlayerService } from "./player.service";
import { UserService } from "./user.service";

export class UnitOfWOrk
{   
    players: PlayerService;
    users: UserService;
    games: GameService;
    hexagons: HexagonService;
    constructor()
    {
        this.players = new PlayerService();
        this.users = new UserService();
        this.games = new GameService();
        this.hexagons = new HexagonService();
    }
}