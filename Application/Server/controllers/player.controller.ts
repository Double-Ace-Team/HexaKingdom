import { NextFunction, Request, Response } from "express";
import { basename } from "path";
import { Player } from "../Model/Player";
import { sendResponse } from "../utils/response";
import { BaseController } from "./base.controller";

export class PlayerController extends BaseController
{
    async create(req: Request, res: Response, next: NextFunction){

        try {
            const player = req.body.player as Player;

            const userID = req.body.userID as string;

            const payload = await this.unit.players.create(player, userID);
            
            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }

    async get(req: Request, res: Response, next: NextFunction){

        try {
            const playerID = req.params.id;
            
            const payload = await this.unit.players.get(playerID);

            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }
}