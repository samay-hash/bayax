import { Router } from "express";
import { IdeaController } from "../controller/idea.controller";
import { auth } from "../middlewares/auth";

const ideaRouter = Router();
const ideaController = new IdeaController();

ideaRouter.post("/analyze", auth, ideaController.analyzeIdea);
ideaRouter.get("/", auth, ideaController.viewAllProjects);
ideaRouter.get("/:id", auth, ideaController.viewProject);

export { ideaRouter };
