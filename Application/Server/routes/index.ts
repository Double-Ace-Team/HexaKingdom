import { Express, NextFunction } from "express";
import ApplicationError from "../utils/error/application.error";
import { httpErrorTypes } from "../utils/error/types.error";
import * as ErrorController from "../controllers/error.controller"
import playerRoute from "./player.route"
import userRoute from "./user.route"
import gameRoute from "./game.route"
//import hexagonRoute from "./hexagon.route"

export default function (app: Express) {

    app.use("/player", playerRoute);
    app.use("/user", userRoute);
    app.use("/game", gameRoute);
    //app.use("/hexagon", hexagonRoute)
    // app.use((req, res, next) => {
    //     next(new ApplicationError(httpErrorTypes.RESOURCE_NOT_FOUND));
    // });
    app.use(ErrorController.errorHandler);

}