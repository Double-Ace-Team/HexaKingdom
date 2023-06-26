import e, { NextFunction, Request, Response } from "express";
import { basename } from "path";
import { Hexagon, hexaStatus } from "../Model/Hexagon";
import { Player } from "../Model/Player";
import { sendResponse } from "../utils/response";
import { BaseController } from "./base.controller";
import { Game } from "../Model/Game";
import getSocket from "../socket";
import { Army } from "../Model/hexagons/Army";
import { nullable, undefined } from "zod";
import { Castle } from "../Model/hexagons/Castle";

export class PlayerController extends BaseController
{
    async create(req: Request, res: Response, next: NextFunction){

        try {
            const player = req.body.player as Player;
            if(player == null) {throw new Error("Please insert body of player");}

            const userID = req.body.userID as string;
            if(userID == null) {throw new Error("Please insert userID");}

            const payload = await this.unit.players.create(player, userID);
            
            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }

    async get(req: Request, res: Response, next: NextFunction){

        try {
            const playerID = req.params.id;
            if(playerID == null) {throw new Error("Please insert playerID");}
            
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

            const playerID =  req.body.playerID as string;       

            const hexagonSrcID = req.body.hexagonSrcID as string;     
                 
            const hexagonDstID =  req.body.hexagonDstID as string; 
            
            this.checkValidatons(gameID, playerID, hexagonSrcID, hexagonDstID, 1);
            

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

    async setResources(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            const gameID = req.body.gameID as string;

            const playerID = req.body.playerID as string;            

            const hexagonID = req.body.hexagonID as string;            

            const resources = req.body.resources as number;

            this.checkValidatons(gameID, playerID, hexagonID, 'redundant parameter', resources);
            

            
           let payload = await this.unit.hexagons.setResources(gameID, playerID, hexagonID, resources);

            return sendResponse(res, payload);
        }
        catch (error)
        {
            next(error);
        }
    }
    //This method ought NOT to be called from Client(HTTP request), it's service function is called as helper to playerService.
    //Feel free to remove it from here and routes directory.
    async eliminatePlayer(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            const gameID = req.body.gameID as string;            

            const armyHexa = req.body.armyHexa as Army;

            const castleHexa = req.body.armyCastle as Castle;
            
            this.checkValidatons(gameID, 'redundant parameter', armyHexa._id!.toString(), castleHexa._id!.toString(), 1);
            
            let payload = await this.unit.players.eliminatePlayer(gameID, armyHexa, castleHexa);

            return sendResponse(res, payload);
        }
        catch (error)
        {
            next(error);
        }
    }

    async createNewArmy(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            const gameID = req.body.gameID as string;

            const playerID = req.body.playerID as string;                  

            

            this.checkValidatons(gameID, playerID, 'redundant parameter', 'redundant parameter', 1);
                    
            let payload = await this.unit.hexagons.createNewArmy(gameID, playerID);

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
    

            const playerID = req.body.playerID as string;
            
            this.checkValidatons(gameID, playerID, 'redundant parameter', 'redundant parameter', 1);

            let payload = await this.unit.players.endTurn(gameID, playerID);

            return sendResponse(res, payload);
        } 
        catch (error) 
        {
            next(error);
        }
    }
    //eliminating duplication of code(hard coding) with little compromise of  added compiler usage
    //(function, params, redundant validations)
    
    checkValidatons(gameID: string, playerID: string , hexagonSrcID: string , hexagonDstID: string, resources: number)
    {
        
            if(gameID == null) {throw new Error("Please insert gameID");}
            if(playerID == null) {throw new Error("Please insert playerID");}
            if(hexagonSrcID == null) {throw new Error("Please insert source hexagonID");}
            if(hexagonDstID == null) {throw new Error("Please insert destination hexagonID");}
            if(resources == null) {throw new Error("Please insert resources");} 
           
    }

    
}