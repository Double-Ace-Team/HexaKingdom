import mongoose from "mongoose";

const Schema = mongoose.Schema;


const option= {
    discriminatorKey: "type",
    collection: "hexagons",
    timestamps: true
};

export const hexaSchema = new Schema
({
    hexaStatus: Number,
    ownerID: {type: mongoose.SchemaTypes.ObjectId, ref: "players"},
    playerStatus: Number,
    points: Number,
    q: Number,
    r: Number,
    s: Number
}, option);


