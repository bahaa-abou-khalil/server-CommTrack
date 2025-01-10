import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    signInWithSlack,
    signInCallback,
    slackEvents,
    } from "./auth.controller.js"

const authRouter = new Router();

authRouter.get("/", signInWithSlack);
authRouter.get("/welcome", signInCallback);

const router = new AppRouter({
    prefix: "/slackAuth",
    router: authRouter,
    middlewares: [],
  });

export default router;