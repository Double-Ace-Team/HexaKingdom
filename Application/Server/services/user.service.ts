import { usersDB } from "../db/db-model";
import { User } from "../Model/User";
import { BaseService } from "./base.service";

export class UserService extends BaseService
{
    async create(user: User)
    {
        //const newPlayer = new playersDB(player);

        try 
        {   console.log("test")
            console.log(user);
            const result = await usersDB.create(user); 
            
            return result;

        } 
        catch (error) 
        {
            console.log(error);
        }

        return null
    }
    
    async get(userID: string)
    {

        try 
        {

            const user = await usersDB.findById(userID);
            return user

        } 
        catch (error)
        {

            console.log(error);

        }

        return null

    }

    async getByUsername(username: string)
    {

        try 
        {

            const user = await usersDB.findOne( {"username": username});
            return user

        } 
        catch (error)
        {

            console.log(error);

        }

        return null

    }
    async update(user: User)
    {

        try 
        {
            await usersDB.findByIdAndUpdate(user._id, {username: user.username, password: user.password, player: user.player}); //await obavezno!
            return user                                                                                 //playerID: string?

        } 
        catch (error)
        {

            console.log(error);

        }

        return null

    }

    async delete(userID: string)
    {

        try 
        {

            const user = await usersDB.findByIdAndRemove(userID);

            return user

        } 
        catch (error) 
        {

            console.log(error);

        }

        return null

    }

    
    
}