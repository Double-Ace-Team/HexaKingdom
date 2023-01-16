import express from "express";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

const userController = new UserController();

router.post("/", userController.create.bind(userController));

router.post("/login", userController.login.bind(userController));

router.get("/:id", userController.get.bind(userController));

router.delete("/:id", userController.delete.bind(userController));

router.put("/:id", userController.update.bind(userController));


export default router;