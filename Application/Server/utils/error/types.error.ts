import ApplicationError from "./application.error";

export const httpErrorTypes = { //moze httpErrorTypes.(UNAUTHORIZED) ili httpErrorTypes(UNAUTHORIZED); Literal object.(i kao object i kao dictionary)
  UNKNOWN_ERROR: {
    type: ApplicationError.type.APP_NAME,
    code: "UNKNOWN_ERROR",
    message: "Unknown error",
    statusCode: 500,
  },
  BAD_REQUEST: {
    type: ApplicationError.type.NETWORK,
    code: "BAD_REQUEST",
    message: "Bad request",
    statusCode: 400,
  },
  UNAUTHORIZED: {
    type: ApplicationError.type.NETWORK,
    code: "UNAUTHORIZED",
    message: "Unauthorized",
    statusCode: 401,
  },
  FORBIDDEN: {
    type: ApplicationError.type.NETWORK,
    code: "FORBIDDEN",
    message: "Forbidden",
    statusCode: 403,
  },
  RESOURCE_NOT_FOUND: {
    type: ApplicationError.type.NETWORK,
    code: "RESOURCE_NOT_FOUND",
    message: "Resource not found",
    statusCode: 404
  },
  INTERNAL_SERVER_ERROR: {
    type: ApplicationError.type.NETWORK,
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong, Please try again later.",
    statusCode: 500
  }
};