import e, { NextFunction, Request, Response } from "express";
import { basename } from "path";
import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { sendResponse } from "../utils/response";
import { BaseController } from "./base.controller";
import { Game } from "../Model/Game";
import getSocket from "../socket";
import { Army } from "../Model/hexagons/Army";

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
          
            const gameID = req.body.gameID as string;
            if(gameID == null) {throw new Error("Please insert gameID");}

            const playerID =  req.body.playerID as string; 
            if(playerID == null) {throw new Error("Please insert playerID");}
          
            const hexagonSrcID = req.body.hexagonSrcID as string;
            if(hexagonSrcID == null) {throw new Error("Please insert source hexagonID");}

            const hexagonDstID =  req.body.hexagonDstID as string; 
            if(hexagonDstID == null) {throw new Error("Please insert destination hexagonID");}

            

            let payload = await this.unit.players.makeMove(gameID, playerID, hexagonSrcID, hexagonDstID);

            //console.log(payload)
            //payload je null
            //if(payload)
            //{
                const io = getSocket.getInstance();
                io.of("main").to(gameID).emit("update_game");
            //}
            
            
            return sendResponse(res, payload);
        } 
        catch (error) 
        {
            next(error);
        }
    }

    async endTurn(req: Request, res: Response, next: NextFunction)
    {

        try 
        {
            const gameID = req.body.gameID as string;
            if(gameID == null) {throw new Error("Please insert gameID");}

            const playerID = req.body.playerID as string;
            if(playerID == null) {throw new Error("Please insert playerID");}

            let payload = await this.unit.players.endTurn(gameID, playerID);

            return sendResponse(res, payload);
        } 
        catch (error) 
        {
            next(error);
        }
    }

    

}