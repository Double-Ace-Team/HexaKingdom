import { IModel } from "./IModel";

export  interface Message extends IModel
{
    userID: string;
    username: string;
    text: string;
    createdAt: Date;
}