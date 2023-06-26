import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const playerSchema = new Schema//<player> ts
({
    resources: Number,
    user: {type: mongoose.SchemaTypes.ObjectId, ref: "users"},
    game: {type: mongoose.SchemaTypes.ObjectId, ref: "games"},
    color: String,
    playerStatus: Number
});






