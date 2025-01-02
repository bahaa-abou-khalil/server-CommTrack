import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    getAllDiscussions
} from "./discussions.controller.js";

// import { authMiddleware } from "../../middlewares/auth.middleware.js";


const discussionsRouter = new Router();

discussionsRouter.post("/", getAllDiscussions);

const router = new AppRouter({
    prefix: "/discussions",
    router: discussionsRouter,
    middlewares: [],
  });

export default router;