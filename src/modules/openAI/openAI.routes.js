import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    analyzeMessages
} from "./openAI.controller.js"

const opeAIRouter = new Router();

opeAIRouter.get("/", analyzeMessages);

const router = new AppRouter({
    prefix: "/openAI",
    router: opeAIRouter,
    middlewares: [],
  });

export default router;