import mongoose, { Types } from "mongoose";
import { armiesDB, gamesDB, plainsDB, playersDB } from "../db/db-model";
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
            let map = [
                    {
                        "q": 0,
                        "r": 0,
                        "s": 0
                    },
                    {
                        "q": 0,
                        "r": 1,
                        "s": -1
                    },
                    {
                        "q": 0,
                        "r": 2,
                        "s": -2
                    },
                    {
                        "q": 0,
                        "r": 3,
                        "s": -3
                    },
                    {
                        "q": 0,
                        "r": 4,
                        "s": -4
                    },
                    {
                        "q": 1,
                        "r": 0,
                        "s": -1
                    },
                    {
                        "q": 1,
                        "r": 1,
                        "s": -2
                    },
                    {
                        "q": 1,
                        "r": 2,
                        "s": -3
                    },
                    {
                        "q": 1,
                        "r": 3,
                        "s": -4
                    },
                    {
                        "q": 1,
                        "r": 4,
                        "s": -5
                    },
                    {
                        "q": 2,
                        "r": -1,
                        "s": -1
                    },
                    {
                        "q": 2,
                        "r": 0,
                        "s": -2
                    },
                    {
                        "q": 2,
                        "r": 1,
                        "s": -3
                    },
                    {
                        "q": 2,
                        "r": 2,
                        "s": -4
                    },
                    {
                        "q": 2,
                        "r": 3,
                        "s": -5
                    },
                    {
                        "q": 3,
                        "r": -1,
                        "s": -2
                    },
                    {
                        "q": 3,
                        "r": 0,
                        "s": -3
                    },
                    {
                        "q": 3,
                        "r": 1,
                        "s": -4
                    },
                    {
                        "q": 3,
                        "r": 2,
                        "s": -5
                    },
                    {
                        "q": 3,
                        "r": 3,
                        "s": -6
                    },
                    {
                        "q": 4,
                        "r": -2,
                        "s": -2
                    },
                    {
                        "q": 4,
                        "r": -1,
                        "s": -3
                    },
                    {
                        "q": 4,
                        "r": 0,
                        "s": -4
                    },
                    {
                        "q": 4,
                        "r": 1,
                        "s": -5
                    },
                    {
                        "q": 4,
                        "r": 2,
                        "s": -6
                    }
                ]
            let s = 0;
            let r = 0;
            let mapSize = 5
            for(let q = 0; q < mapSize; q++)
            {   
                for(let i = 0; i < mapSize; i++){
                    
                    if(q == 1 && (r + i) == 1 && (s - i) == -2)
                    {
                        newGame.hexagons.push(new armiesDB({size: 10, moves: 1, hexaStatus: 0, ownerID:"", playerStatus: 0, points: 0, q: q, r: (r + i), s: (s - i),}));// i:( q * mapSize + i)
                    }
                    else{
                        newGame.hexagons.push(new plainsDB({hexaStatus: 0, ownerID:"", playerStatus: 0, points: 0, q: q, r: (r + i), s: (s - i),}));// i:( q * mapSize + i)
                    }
                }
                if(q % 2 == 0)
                    s--;
                else
                    r--;

            }
            // ili foreach mapa
            
            
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
            //console.log(game.players)
            const result = await gamesDB.findByIdAndUpdate(game) as Game;
            //console.log(result.players)
            return result;

        } catch (error) {

            console.log(error);

        }

        return null;
    }
    async updateTurnForPlayer(game: Game, newPlayerID: string)
    {
        try {
            console.log(game.turnForPlayerID);
            const result = await gamesDB.findOneAndUpdate
            (
                { 
                    "_id": game._id
                },
                { 
                    "$set": 
                    {
                        "turnForPlayerID": new mongoose.Types.ObjectId(newPlayerID)
                    }
                }
            );
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