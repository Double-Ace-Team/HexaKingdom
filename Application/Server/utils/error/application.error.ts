export default class ApplicationError extends Error { //error u c# je Exception class.
    static type = {
      APP_NAME: "SocialQnA",
      INTERNAL: "INTERNAL",
      NETWORK: "NETWORK",
      UNKNOWN: "UNKNOWN",
    };

    name: string;
    type: string;
    code: number;
    errors: [];
    statusCode: number;
  
    constructor(options: any) {
      super();
  
      if (!ApplicationError.type.hasOwnProperty(options.type)) {
        throw new Error(`ApplicationError: ${options.type} is not a valid type.`);
      }
  
      if (!options.message) {
        throw new Error("ApplicationError: error message required.");
      }
  
      if (!options.code) {
        throw new Error("ApplicationError: error code required.");
      }
  
      this.name = "ApplicationError";
      this.type = options.type;
      this.code = options.code;
      this.message = options.message;
      this.errors = options.errors;
      this.statusCode = options.statusCode;
    }
}