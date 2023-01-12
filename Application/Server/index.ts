import express from "express";
import dotenv from "dotenv"
import http from "http"
import app from "./app";
import mongoose from "mongoose"
import { connectMongoDB } from "./db/conn";

dotenv.config()
import {usersDB} from "./db/db-model"
async function main()
{
    connectMongoDB()

    const port = process.env.SERVER_PORT || 5000;
    const server = http.createServer(app)

    

    server.listen(port, () => {
        console.log("server started at port: " + port)
    })

    // console.log(usersDB.find({name: "Vexx"}));
    // //db.myCol.find({"name" : "sunita"});
}

main()