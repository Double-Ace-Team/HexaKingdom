import { IModel } from "./IModel";
import { User } from "./User";

export interface Message extends IModel
{ 
    userID?: User;
    username: string;
    text: string;
    createdAt: Date;

}