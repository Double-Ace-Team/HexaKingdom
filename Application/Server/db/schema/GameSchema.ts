
import mongoose from "mongoose";
import { hexaSchema } from "./HexagonSchema";

const Schema = mongoose.Schema;

export const gameSchema = new Schema
({  
    players: [mongoose.SchemaTypes.ObjectId],// {type:mongoose.SchemaTypes.ObjectId, ref:"players"}
    numbOfPlayers: Number,
    hexagons: [hexaSchema],
    turnNumber: Number,
    isFinished: Boolean,
    playerCreatedID: mongoose.SchemaTypes.ObjectId,
    playerWonID: mongoose.SchemaTypes.ObjectId,
    turnForPlayerID: mongoose.SchemaTypes.ObjectId,
    createdAt: Date
});

