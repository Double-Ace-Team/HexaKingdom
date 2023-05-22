import express, { NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import route from "./routes/index"

dotenv.config(); 
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(helmet({ contentSecurityPolicy: false }));
route(app);

export default app;

