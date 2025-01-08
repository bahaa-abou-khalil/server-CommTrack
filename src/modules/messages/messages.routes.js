import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    postMessageToChannel
    } from "./messages.controller.js"
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const messagesRouter = new Router();

messagesRouter.post("/", postMessageToChannel);

const router = new AppRouter({
    prefix: "/messages",
    router: messagesRouter,
    middlewares: [],
  });

export default router;