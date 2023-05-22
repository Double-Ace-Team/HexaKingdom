import { NextFunction, Request, Response } from "express";
// import { ZodError } from "zod";
import ApplicationError from "../utils/error/application.error";
import { createError } from "../utils/error/factory.error";
import { httpErrorTypes } from "../utils/error/types.error";
import { formatError, sendResponse } from "../utils/response";


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ApplicationError) {
        const code = err.code || 500
        return res.status(code).json(formatError(err));
       
    }
   
    // if (err instanceof ZodError) {
    //     const code = 400;
    //     return res.status(code).json(formatError(err));
    // }
    
    if (err instanceof Error) {
        console.log(err);
        const newError = createError();
        const code = newError.statusCode || 500
        return res.status(code).json(formatError(newError))
    }
    
    const unknownError = new ApplicationError(httpErrorTypes.UNKNOWN_ERROR);
    
    return sendResponse(res, unknownError);
}