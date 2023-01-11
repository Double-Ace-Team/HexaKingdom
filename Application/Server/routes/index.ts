import { Express, NextFunction } from "express";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";
import * as ErrorController from "../controllers/error.controller"

export default function (app: Express) {





    
    app.use((req, res, next) => {
        next(new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND));
    });
    app.use(ErrorController.errorHandler);

}