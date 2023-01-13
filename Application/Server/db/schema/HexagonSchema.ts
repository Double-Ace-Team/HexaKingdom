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
    hexaType: String,
    ownerID: mongoose.SchemaTypes.ObjectId,
    playerStatus: Number,
    points: Number
}, option);


