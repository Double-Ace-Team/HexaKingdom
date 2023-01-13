import mongoose from "mongoose";

const Schema = mongoose.Schema;


export const armySchema = new Schema
({
    size: Number,
    moves: Number,

});


