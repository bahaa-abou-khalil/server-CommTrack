import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    getLeaderBoard
    } from "./leaderBoard.controller.js"
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const leaderBoardRouter = new Router();

leaderBoardRouter.get("/",getLeaderBoard)

const router = new AppRouter({
    prefix: "/leaderBoard",
    router: leaderBoardRouter,
    middlewares: [authMiddleware],
  });

export default router;