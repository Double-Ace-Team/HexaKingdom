import mongoose from "mongoose";
import { Hexagon } from "../../Model/Hexagon";

const Schema = mongoose.Schema;


const option= {
    discriminatorKey: "type",
    collection: "hexagons",
    timestamps: true
};

export const hexaSchema = new Schema<Hexagon>
({
    hexaStatus: Number,
    ownerID: {type: mongoose.SchemaTypes.ObjectId, ref: "players"},
    points: Number,
    q: Number,
    r: Number,
    s: Number
}, option);


