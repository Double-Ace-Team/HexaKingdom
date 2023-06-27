import { NextFunction, Request, Response } from "express";
import { armySchema } from "../db/schema/Hexagons/ArmySchema";
import { Game } from "../Model/Game";
import { Hexagon } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { User } from "../Model/User";
import getSocket from "../socket";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";
import { sendResponse } from "../utils/response";
import { BaseController } from "./base.controller";

export class GameController extends BaseController
{

    static playerColor: string[] = ["red", "blue", "green", "yellow"];

    async create(req: Request, res: Response, next: NextFunction){

        try {
            const userID = req.body.userID
            const player = await this.unit.players.create({resources: 0, playerStatus: 0, color: GameController.playerColor[0]}, userID) as Player
            const numberOfPlayers = req.body.numberOfPlayers as number;
            if(!player) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            const game = {
                numbOfPlayers: numberOfPlayers,
                isFinished: false,
                isStarted: false,
                createdAt: new Date(),
                players: Array(),
                hexagons: Array(),
                turnNumber: 0
            } as Game
            
            const payload = await this.unit.games.create(player, game);

            if(!payload) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);
            

            return sendResponse(res, {_id: payload._id, playerID: player._id});
        } catch (error) {
            next(error);
        }
    }

    async get(req: Request, res: Response, next: NextFunction){

        try {
            const gameID = req.params.id;
            const userID = req.body.userID;

            const payload = await this.unit.games.get(gameID);
            
            let flag = false;

            payload?.players.forEach(player => {
                if (player.user?._id == userID)
                    flag = true; 
            });
            
            if(!payload || !flag) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }

    async join(req: Request, res: Response, next: NextFunction){

        try {

            const gameID = req.body.gameID as string;
            const userID = req.body.userID as string;

            const game = await this.unit.games.get(gameID) ;

            if(!game)
                throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);


            if(game?.numbOfPlayers <= game?.players.length)
            {      

                throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);
            }

            const player = await this.unit.players.create({resources: 0, playerStatus: 0, color: GameController.playerColor[game.players.length]}, userID) as Player

            // // const playerID = player._id
            if (!player._id) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            game.players.push(player);

            //const payload = await this.unit.games.update(game);
            const payload = await this.unit.games.join(gameID, player?._id.toString());
           
            const io = getSocket.getInstance();
            
            player.user = await this.unit.users.get(userID) as User;
            
            io.of("main").to(gameID).emit("player_joined", player);
          
            if(!payload) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            return sendResponse(res, {gameID: game._id, playerID: player._id});
        } catch (error) {
            next(error);
        }
    }

    async start(req: Request, res: Response, next: NextFunction){

        try {
            const gameID = req.body.gameID;
            const userID = req.body.userID;

            const game = await this.unit.games.get(gameID);
            if(!game)
                throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);
            if(game.userCreatedID.toString() != userID)
                throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);
            if(game.isStarted == true)
                throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);            
            // game.isStarted = true;
            
            // const payload = await this.unit.games.update(game);
            
            const payload = await this.unit.games.start(game);
            const io = getSocket.getInstance();
            io.of("main").to(gameID).emit("game_started", game.hexagons);

            if(!payload) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }
    async sendMessage(req: Request, res: Response, next: NextFunction){
        try{
            console.log(req.body);

            const gameID = req.body.gameID;
            
            const userID = req.body.userID;
            
            const text = req.body.text;
            await this.unit.games.sendMessage(gameID, userID, text);

        }catch(error){
            next(error);
        }
    
    }

    async getNonStartedGames(req: Request, res: Response, next: NextFunction){

        try {
            const payload = await this.unit.games.getNonStartedGames();
            
            if(!payload) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }
}