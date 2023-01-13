import { NextFunction, Request, Response } from "express";
import { armySchema } from "../db/schema/Hexagons/ArmySchema";
import { Game } from "../Model/Game";
import { Player } from "../Model/Player";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";
import { sendResponse } from "../utils/response";
import { BaseController } from "./base.controller";

export class GameController extends BaseController
{
    async create(req: Request, res: Response, next: NextFunction){

        try {
            const player = req.body.player as Player;
            const numberOfPlayers = req.body.numberOfPlayers as number;

            const game = {
                numbOfPlayers: 2,
                isFinished: false,
                isStarted: false,
                createdAt: new Date(),
                players: Array(),
                hexagons: Array(),
                turnNumber: 0
            } as Game
            
            const payload = await this.unit.games.create(player, game);

            if(!payload) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);
            
            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }

    async get(req: Request, res: Response, next: NextFunction){

        try {
            const gameID = req.params.id;
            
            const payload = await this.unit.games.get(gameID);
            
            if(!payload) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }

    async join(req: Request, res: Response, next: NextFunction){

        try {
            const gameID = req.body.gameID as string;

            const playerID = req.body.playerID as string;

            const payload = await this.unit.games.join(gameID, playerID);
            
            if(!payload) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }

    async start(req: Request, res: Response, next: NextFunction){

        try {
            const gameID = req.params.id;
            
            const game = await this.unit.games.get(gameID) as Game;
            
            game.isStarted = true;
            
            const payload = await this.unit.games.start(game);

            if(!payload) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }


}