import mongoose, { Types } from "mongoose";
import { armiesDB, castlesDB, gamesDB, messageDB, minesDB, plainsDB, playersDB, usersDB } from "../db/db-model";
import { Game } from "../Model/Game";
import { Player } from "../Model/Player";
import { BaseService } from "./base.service";
import getSocket from "../socket";
import { Message } from "../Model/Message";
import { User } from "../Model/User";
import ApplicationError from "../utils/error/application.error";

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
            // let map = [
            //         {
            //             "q": 0,
            //             "r": 0,
            //             "s": 0
            //         },
            //         {
            //             "q": 0,
            //             "r": 1,
            //             "s": -1
            //         },
            //         {
            //             "q": 0,
            //             "r": 2,
            //             "s": -2
            //         },
            //         {
            //             "q": 0,
            //             "r": 3,
            //             "s": -3
            //         },
            //         {
            //             "q": 0,
            //             "r": 4,
            //             "s": -4
            //         },
            //         {
            //             "q": 1,
            //             "r": 0,
            //             "s": -1
            //         },
            //         {
            //             "q": 1,
            //             "r": 1,
            //             "s": -2
            //         },
            //         {
            //             "q": 1,
            //             "r": 2,
            //             "s": -3
            //         },
            //         {
            //             "q": 1,
            //             "r": 3,
            //             "s": -4
            //         },
            //         {
            //             "q": 1,
            //             "r": 4,
            //             "s": -5
            //         },
            //         {
            //             "q": 2,
            //             "r": -1,
            //             "s": -1
            //         },
            //         {
            //             "q": 2,
            //             "r": 0,
            //             "s": -2
            //         },
            //         {
            //             "q": 2,
            //             "r": 1,
            //             "s": -3
            //         },
            //         {
            //             "q": 2,
            //             "r": 2,
            //             "s": -4
            //         },
            //         {
            //             "q": 2,
            //             "r": 3,
            //             "s": -5
            //         },
            //         {
            //             "q": 3,
            //             "r": -1,
            //             "s": -2
            //         },
            //         {
            //             "q": 3,
            //             "r": 0,
            //             "s": -3
            //         },
            //         {
            //             "q": 3,
            //             "r": 1,
            //             "s": -4
            //         },
            //         {
            //             "q": 3,
            //             "r": 2,
            //             "s": -5
            //         },
            //         {
            //             "q": 3,
            //             "r": 3,
            //             "s": -6
            //         },
            //         {
            //             "q": 4,
            //             "r": -2,
            //             "s": -2
            //         },
            //         {
            //             "q": 4,
            //             "r": -1,
            //             "s": -3
            //         },
            //         {
            //             "q": 4,
            //             "r": 0,
            //             "s": -4
            //         },
            //         {
            //             "q": 4,
            //             "r": 1,
            //             "s": -5
            //         },
            //         {
            //             "q": 4,
            //             "r": 2,
            //             "s": -6
            //         }
            //     ]
            // let map = [ ['p', 'p', 'p', 'p', 'p'],
            //             ['p', 'a', 'p', 'p', 'p'],
            //             ['p', 'p', 'a', 'p', 'p'],
            //             ['p', 'p', 'p', 'p', 'p'],
            //             ['p', 'p', 'p', 'p', 'p']]
            // let s = 0;
            // let r = 0;
            // let mapSize = 5
            // for(let q = 0; q < mapSize; q++)
            // {   
            //     for(let i = 0; i < mapSize; i++){
            //         if(map[q][i] == 'a')
            //         {
            //             newGame.hexagons.push(new armiesDB({size: 10, moves: 1, hexaStatus: 0, ownerID:"", playerStatus: 0, points: 0, q: q, r: (r + i), s: (s - i),}));// i:( q * mapSize + i)
            //         }
            //         else{
            //             newGame.hexagons.push(new plainsDB({hexaStatus: 0, ownerID:"", playerStatus: 0, points: 0, q: q, r: (r + i), s: (s - i),}));// i:( q * mapSize + i)
            //         }
            //     }
            //     if(q % 2 == 0)
            //         s--;
            //     else
            //         r--;

            // }
            // ili foreach mapa
            
            
            newGame.userCreatedID = player.user;
            newGame.turnForPlayerID = player.id
            newGame.players.push(player.id)
            
            //map type
            

            const result = await newGame.save();
            const user = await usersDB.findById(player.user);
            getSocket.getInstance().of("main").emit("new_game_created", 
                {numbOfPlayers: newGame.numbOfPlayers, _id:newGame.id, userCreatedID:{_id:user?.id, username:user?.username}, players: newGame.players}
            );

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

            const user = await usersDB.findById(player.user);
            getSocket.getInstance().of("main").emit("new_game_created", 
                {numbOfPlayers: game.numbOfPlayers, _id:game.id, userCreatedID:{_id:user?.id, username:user?.username}, players: game.players}
            );
            return game;

        } catch (error) {

            console.log(error);

        }

        return null;
    }

    async start(game: Game)
    {

        try {

            const result = await gamesDB.findById(game._id); //result == game
            if(!result)
                return new Error();
            console.log(result.players.length,result.numbOfPlayers)
            if(result.players.length != result.numbOfPlayers)
                throw new ApplicationError("Not enough players");

            let s = 0;
            let r = 0;
            let mapSize = 5
            
            let map = [ ['m2', 'p', 'c2', 'p', 'm2'],
                        ['p', 'p', 'a2', 'p', 'p'],
                        ['p', 'p', 'p', 'p', 'p'],
                        ['p', 'p', 'a1', 'p', 'p'],
                        ['m1', 'p', 'c1', 'p', 'm1']]
            let mapTemp = []
            //transpose matrix
            for(let x = 0; x < mapSize; x++)
            {
                mapTemp[x] = new Array<string>() 
                for(let y = 0; y < mapSize; y++)
                {
                    mapTemp[x].push(map[y][x])
                }
            }

            map = mapTemp
            for(let q = 0; q < mapSize; q++)
            {   
                for(let i = 0; i < mapSize; i++){
                    if(map[q][i][0] == 'a')
                    {
                        let playerIndex:number = +map[q][i][1] - 1
                        console.log(playerIndex);
                        console.log(result.players[playerIndex])
                        console.log(result.players)
                        result.hexagons.push(new armiesDB({size: 10, moves: 3, hexaStatus: 0, ownerID: result.players[playerIndex], playerStatus: 0, points: 0, q: q, r: (r + i), s: (s - i),}));// i:( q * mapSize + i)
                    }
                    else if(map[q][i][0] == 'm')
                    {
                        let playerIndex:number = +map[q][i][1] - 1
                        result.hexagons.push(new minesDB({revenue: 1, ownerID: result.players[playerIndex], playerStatus: 0, points: 0, q: q, r: (r + i), s: (s - i)}))
                    }
                    else if(map[q][i][0] == 'c')
                    {
                        let playerIndex:number = +map[q][i][1] - 1
                        result.hexagons.push(new castlesDB({size: 2, ownerID: result.players[playerIndex], playerStatus: 0, points: 0, q: q, r: (r + i), s: (s - i)}))
                    }
                    else{
                        result.hexagons.push(new plainsDB({hexaStatus: 0, ownerID:"", playerStatus: 0, points: 0, q: q, r: (r + i), s: (s - i),}));// i:( q * mapSize + i)
                    }
                }
                if(q % 2 == 0)
                    s--;
                else
                    r--;

            }
            result.isStarted = true;
            
            await result.save()

            return result;

        } catch (error) {

            console.log(error);

        }

        return null;

    }
    async sendMessage(gameID: string, userID: string, text: string)
    {
        const result = await gamesDB.findById(gameID); 
        const user = await usersDB.findById(userID);

        if(!result || !user)
            return new Error();
        const message = new messageDB({username: user.username, userID: user.id, text: text, createdAt: Date.now()});
        result.messages.push(message);

        await result.save();
        
        //CHANGE EVENT TO MESSAGE_SENT EVENT
        getSocket.getInstance().of("main").to(gameID).emit("message_sent", message);
    }
        
    async getNonStartedGames()
    {
        try{
            const games = await gamesDB.find()
                                        .select("numbOfPlayers userCreatedID players")
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