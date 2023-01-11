import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import route from "./routes/index"

dotenv.config(); 

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(helmet({ contentSecurityPolicy: false })); //http header analogija; atributi headera analogija

route(app);

export default app;
