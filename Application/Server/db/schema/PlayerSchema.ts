import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const playerSchema = new Schema//<player> ts
({
    resources: Number,
    user: mongoose.SchemaTypes.ObjectId,
    game: mongoose.SchemaTypes.ObjectId,
    playerStatus: Number
});






