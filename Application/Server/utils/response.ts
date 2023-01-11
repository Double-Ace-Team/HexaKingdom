import ApplicationError from "./error/application.error"
import { createError } from "./error/factory.error"
//rucno pravljen fajl;imamo statuse konkrente informacije sa podacima;
export function sendResponse(res: any, payload: any, statusCode = 200) {
  if (payload instanceof ApplicationError) {
    const code = payload.statusCode || 500;
    return res.status(code).json(formatError(payload));
  }

  if (payload instanceof Error) {
    const newError = createError();
    const code = newError.statusCode || 500;
    return res.status(code).json(formatError(newError));
  }

  return res.status(statusCode).json(formatResponse(payload));
}
  
export function formatResponse(result: any) {
    return {
        data: result,
        success: true,
    }
}
  
export function formatError(error: any) {
    // const stackTrace = JSON.stringify(error, ['stack'], 4) || { }
    const newError = JSON.parse(JSON.stringify(error))

    newError.statusCode = undefined

    return {
        error: {
        ...newError,
        // stack: stackTrace
        },
        success: false,
    }
}
//const i let >>> var zbog hoisting-a i gresaka; bolja praksa;
export const setTokenInCookie = (res: any, token: string, time: string | number) => {
    res.cookie('token', token, 
    {
        httpOnly: true,
        maxAge: time
    });
}