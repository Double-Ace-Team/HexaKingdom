import express from "express";
import dotenv from "dotenv"
import http from "http"
import app from "./app";
import mongoose from "mongoose"
import { connectMongoDB } from "./db/conn";

dotenv.config()
import {usersDB} from "./db/db-model"
import Websocket from "./socket";
import MainSocket from "./utils/main.socket";
async function main()
{
    connectMongoDB()

    const port = process.env.SERVER_PORT || 5000;
    const server = http.createServer(app)

    

    server.listen(port, () => {
        console.log("server started at port: " + port)
    })
    //socketListen(server);
    const io = Websocket.getInstance(server);
    io.initializeHandlers([
        { path: '/main', handler: new MainSocket() }
    ]);
    // console.log(usersDB.find({name: "Vexx"}));
    // //db.myCol.find({"name" : "sunita"});
}

main()