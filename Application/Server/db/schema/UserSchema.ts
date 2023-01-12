import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const userSchema = new Schema
({
    username:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    player: mongoose.SchemaTypes.ObjectId
});





