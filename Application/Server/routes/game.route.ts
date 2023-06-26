import express from "express";
import { GameController } from "../controllers/game.controller";

const router = express.Router();

const gameController = new GameController();

router.post("/", gameController.create.bind(gameController));


router.get("/getNonStartedGames", gameController.getNonStartedGames.bind(gameController));

router.put("/join", gameController.join.bind(gameController));

router.put("/start", gameController.start.bind(gameController));

router.post("/:id", gameController.get.bind(gameController));

router.put("/sendMessage", gameController.sendMessage.bind(gameController));

export default router;