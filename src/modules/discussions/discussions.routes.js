import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    getAllDiscussions,
    createDiscussion
} from "./discussions.controller.js";

// import { authMiddleware } from "../../middlewares/auth.middleware.js";


const discussionsRouter = new Router();

discussionsRouter.get("/", getAllDiscussions);
discussionsRouter.post("/", createDiscussion);

const router = new AppRouter({
    prefix: "/discussions",
    router: discussionsRouter,
    middlewares: [],
  });

export default router;