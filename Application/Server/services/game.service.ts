import { Types } from "mongoose";
import { gamesDB, plainsDB, playersDB } from "../db/db-model";
import { Game } from "../Model/Game";
import { Player } from "../Model/Player";
import { BaseService } from "./base.service";

export class GameService extends BaseService
{
    async create(playerReq: Player, game: Game)
    {

        try {

            // const newGame = new gamesDB({
            //     numbOfPlayers: numberOfPlayers,
            //     isFinished: false,
            //     isStarted: false,
            //     createdAt: Date.now(),
            //     players: [],
            //     hexagons: [],
            //     turnNumber: 0,
                
            // });
            
            const newGame = new gamesDB(game)

            const player = await playersDB.findById(playerReq._id);

            if(!player)
                return null;

            if(newGame.numbOfPlayers == 2)
            {
                for(let i = 0; i < 25; i++)
                {
                    newGame.hexagons.push(new plainsDB({hexaStatus: 0, hexaType: "Plain", ownerID:"", playerStatus: 0, points: 0}));
                }
            }
            else
            {
                return null
            } 
            
            
            newGame.playerCreatedID = player.id;
            newGame.turnForPlayerID = player.id
            newGame.players.push(player.id)
            
            //map type
            

            const result = await newGame.save();
            
            return result;

        } catch (error) {
            console.log(error);
        }

        return null;
    }
    
    async get(gameID: string)
    {

        try {

            const game = await gamesDB.findById(gameID) as Game;

            return game;

        } catch (error) {

            console.log(error);

        }

        return null;

    }

    async join(gameID: string, playerID: string)
    {
        try {

            const game = await gamesDB.findById(gameID);
            if(!game)
                return null;

            const player = await playersDB.findById(playerID);
            if(!player)
                return null;

            if(!game.numbOfPlayers)
                return null;

            if(game.players.length >= game.numbOfPlayers)
                return null;

            game.players.push(player.id);

            await game.save();

            return game;

        } catch (error) {

            console.log(error);

        }

        return null;
    }

    async start(game: Game)
    {

        try {

            const gameUpdate = await gamesDB.findByIdAndUpdate(game._id, game);

            if(!gameUpdate)
                return null;

            //game.isStarted = false;
            
            //await game.save()
            return gameUpdate;

        } catch (error) {

            console.log(error);

        }

        return null;

    }


    
}