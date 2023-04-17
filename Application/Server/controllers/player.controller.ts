import e, { NextFunction, Request, Response } from "express";
import { basename } from "path";
import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { sendResponse } from "../utils/response";
import { BaseController } from "./base.controller";
import { Game } from "../Model/Game";
import getSocket from "../socket";

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
            const gameID = req.body.gameID as string;
            const playerID = req.body.playerID as string;   

            const hexagonSrc = req.body.hexagonSrc as Hexagon;
            const hexagonDst =  req.body.hexagonDst as Hexagon;
            const points = req.body.points as number;
            
            let payload = await this.unit.players.makeMove(playerID, gameID, hexagonSrc, hexagonDst, points)
            if(payload)
            {
                const io = getSocket.getInstance();
                io.of("main").to(gameID).emit("update_game");
            }
            
            
            return sendResponse(res, payload);
        } 
        catch (error) 
        {
            next(error);
        }
    }


}