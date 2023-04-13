import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const connectMongoDB = async () => {
    try {
        const url:string  = process.env.MONGODB_URL!
        await mongoose.connect(url);
                                    
    } catch (err) {
        console.error(err);
    }
}