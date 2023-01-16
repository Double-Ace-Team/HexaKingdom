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


            for(let i = 0; i < 25; i++)
            {
                newGame.hexagons.push(new plainsDB({hexaStatus: 0, ownerID:"", playerStatus: 0, points: 0}));
            }

            
            
            newGame.userCreatedID = player.user;
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

            const result = await gamesDB.findById(gameID).populate({path: "players", populate : {path: "user", select: {"username": 1}}}) as Game;//promeniti

            return result;

        } catch (error) {

            console.log(error);

        }

        return null;

    }

    async update(game: Game)
    {
        try {
            console.log(game.players)
            const result = await gamesDB.findByIdAndUpdate(game) as Game;
            console.log(result.players)
            return result;

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
            {
                return null;
            }
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

            const result = await gamesDB.findById(game._id);

            if(!result)
                return null;

            result.isStarted = true;
            
            await result.save()

            return result;

        } catch (error) {

            console.log(error);

        }

        return null;

    }

    async getNonStartedGames()
    {
        try{
            const games = await gamesDB.find()
                                        .select("numbOfPlayers userCreatedID")
                                        .where("isStarted")
                                        .equals("false")
                                        .populate("userCreatedID", "username");

            return games
        }catch (error) {

            console.log(error);

        }
        return null;
    }


    
}