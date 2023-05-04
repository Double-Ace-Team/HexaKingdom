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
            //provere da li su tela prazna/nevalidna npr.
            const gameID = req.body.gameID as string;
            //const playerID = req.body.playerID as string;   
            
            //const hexagonSrc = req.body.hexagonSrc as Hexagon;
            //id1 i id2 
            const hexagonSrcID = req.body.hexagonSrcID as string;
            const hexagonDstID =  req.body.hexagonDstID as string; //ako nije obican heksa, da li ce u njemu biti prosledjeni specificni atributi kroz telo HTTP zahteva?
            const points = req.body.points as number;
            //console.log(gameID, hexagonSrcID, hexagonDstID, points);
            // console.log(gameID, hexagonSrcID, hexagonDstID, points);
            let payload = await this.unit.players.makeMove(gameID, hexagonSrcID, hexagonDstID, points)
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

    async endTurn(req: Request, res: Response, next: NextFunction)
    {

        try 
        {
            let player = await this.unit.players.get(req.body.playerID) as Player;
            if(player == null) return;
            let game = await this.unit.games.get(req.body.gameID) as Game;
            if(game == null) return;
            if(game.turnForPlayerID != player._id?.toString())
                return;//send response false || throw error
            let newPlayerID: string = "";
            for(let i = 0; i < game.players.length; i++)
            {
                if(game.turnForPlayerID == game.players[i]._id?.toString())
                {
                    i = (i + 1) % game.players.length;
                    newPlayerID = game.players[i]._id?.toString()!;

                    break;
                }
            }

            let payload = await this.unit.games.updateTurnForPlayer(game, newPlayerID);
            if(payload)
            {
                const io = getSocket.getInstance();
                io.of("main").to(req.body.gameID).emit("update_game");
            }
            return sendResponse(res, payload);
        } 
        catch (error) 
        {
            next(error);
        }
    }

}