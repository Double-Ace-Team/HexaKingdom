import mongoose from "mongoose";
const Schema = mongoose.Schema;

const playerSchema = new Schema
({
    resources: Number,
    onTurn: Boolean
    
});

const playersDB = mongoose.model('users', playerSchema);

export
{
    playersDB
}




