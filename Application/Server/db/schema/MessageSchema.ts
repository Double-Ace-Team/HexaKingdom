
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const messageSchema = new Schema
({  
    userID: {type: mongoose.SchemaTypes.ObjectId, ref: "users"},
    username: String,
    text: String,
    createdAt: Date
});

