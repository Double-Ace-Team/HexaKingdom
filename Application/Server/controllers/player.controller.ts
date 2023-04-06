import e, { NextFunction, Request, Response } from "express";
import { basename } from "path";
import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { sendResponse } from "../utils/response";
import { BaseController } from "./base.controller";
import { Game } from "../Model/Game";

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

    async makeMove(req: Request, res: Response, next: NextFunction)
    {

        try 
        {
            //provere da li su tela prazna/nevalidna npr.
            const game = req.body.game as Game;
            const hexagon = req.body.hexagon as Hexagon;
            const player = req.body.player as Player;   
            const points = req.body.points as number;

            let payload = this.unit.players.makeMove(player, game, hexagon, points);
            
            return sendResponse(res, payload);
        } 
        catch (error) 
        {
            next(error);
        }
    }


}