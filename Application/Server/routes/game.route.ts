import express from "express";
import { GameController } from "../controllers/game.controller";

const router = express.Router();

const gameController = new GameController();

router.post("/", gameController.create.bind(gameController));

router.get("/:id", gameController.get.bind(gameController));

router.put("/join", gameController.join.bind(gameController));

router.put("/start/:id", gameController.start.bind(gameController));


export default router;