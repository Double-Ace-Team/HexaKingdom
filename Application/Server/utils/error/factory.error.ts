import ApplicationError from "./application.error";
import { httpErrorTypes } from "./types.error"

export function createError(/* error */) { 
    return new ApplicationError(httpErrorTypes.INTERNAL_SERVER_ERROR); //Factory primer obrazac; ne kreirar ti obj rucno sa new vec f-ju zoves koja to radi.
}