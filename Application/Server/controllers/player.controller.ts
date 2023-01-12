import { NextFunction, Request, Response } from "express";
import { basename } from "path";
import { Player } from "../Model/Player";
import { sendResponse } from "../utils/response";
import { BaseController } from "./base.controller";

export class PlayerController extends BaseController
{
    async create(req: Request, res: Response, next: NextFunction){

        try {
            const player = req.body as Player;


            const payload = await this.unit.players.create(player);
            
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