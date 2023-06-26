import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { User } from "../Model/User";
import { UserService } from "../services/user.service";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";
import { sendResponse } from "../utils/response";
import { BaseController } from "./base.controller";

export class UserController extends BaseController
{
    async create(req: Request, res: Response, next: NextFunction){

        try 
        {

            const user = req.body.user as User;
            // console.log("Kontroler", user);
            // console.log(user.username, user.password, user._id);
            const payload = await this.unit.users.create(user);

            if(!payload) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);
            
            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }

    async get(req: Request, res: Response, next: NextFunction){

        try {
            const userID = req.params.id;
            
            const payload = await this.unit.users.get(userID);
            if(!payload) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);
            return sendResponse(res, payload);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction){

        try {
            const username = req.body.username;
            const password = req.body.password;
            console.log("TEST")
            const user = await this.unit.users.getByUsername(username);
            console.log(user);
            if(!user) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            if(user.password != password) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            return sendResponse(res, user);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction)
    {
        try 
        {
            const user = req.body as User;

            user._id = new Types.ObjectId(req.params.id);

            const result = await this.unit.users.update(user);
            if(!result) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);
        

            return sendResponse(res, result);
        } 
        catch (error) 
        {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction)
    {
        try
        {
            const userid = req.params.id;

            const result = await this.unit.users.delete(userid);
            if(!result) throw new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND);

            return sendResponse(res, {message: "User deleted."});
        }
        catch(error)
        {
            next(error);
        }
    }
}