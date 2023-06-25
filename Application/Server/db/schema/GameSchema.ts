
import mongoose from "mongoose";
import { hexaSchema } from "./HexagonSchema";
import { messageSchema } from "./MessageSchema";

const Schema = mongoose.Schema;

export const gameSchema = new Schema
({  
    players: [{type: mongoose.SchemaTypes.ObjectId, ref: "players"}],// {type:mongoose.SchemaTypes.ObjectId, ref:"players"}
    numbOfPlayers: Number,
    hexagons: [hexaSchema],
    messages: [messageSchema],
    turnNumber: Number,
    isFinished: Boolean,
    isStarted: Boolean,
    userCreatedID: {type: mongoose.SchemaTypes.ObjectId, ref: "users"},
    playerWonID: {type: mongoose.SchemaTypes.ObjectId, ref: "players"},
    turnForPlayerID: {type: mongoose.SchemaTypes.ObjectId, ref: "players"},
    createdAt: Date
});

