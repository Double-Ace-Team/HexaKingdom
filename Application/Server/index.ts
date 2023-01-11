import express from "express";
import dotenv from "dotenv"
import http from "http"
import mongoose from "mongoose"
import { connectMongoDB } from "./db/conn";
const app = express()

dotenv.config()

// mongoose.connect("mongodb://localhost:27017");

// const userSchema = new mongoose.Schema({
//     name: String,
//     age: Number
// })

// mongoose.model("user", userSchema)

async function main()
{
    connectMongoDB()

    const port = process.env.SERVER_PORT || 5000;
    const server = http.createServer(app)


    server.listen(port, () => {
        console.log("server started at port: " + port)
    })

}

main()