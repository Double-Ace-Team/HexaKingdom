import express from "express";
import { PlayerController } from "../controllers/player.controller";

const router = express.Router();

const playerController = new PlayerController();

router.post("/", playerController.create.bind(playerController));

router.get("/:id", playerController.get.bind(playerController));

router.put("/makeMove", playerController.makeMove.bind(playerController));

export default router;