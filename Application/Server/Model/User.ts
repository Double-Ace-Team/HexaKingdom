import { IModel } from "./IModel";
import { Player } from "./Player";

export interface User extends IModel
{
    username: string;
    password: string;
    player?: Player;
    //email: string;
    //firstName, lastName, nickName  
   //salt/token?
}
