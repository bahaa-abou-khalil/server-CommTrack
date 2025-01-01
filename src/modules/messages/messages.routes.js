import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    getMessages,
    postMessageToChannel
    } from "./messages.controller.js"
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const messagesRouter = new Router();

messagesRouter.get("/", getMessages);
messagesRouter.post("/", postMessageToChannel);

const router = new AppRouter({
    prefix: "/messages",
    router: messagesRouter,
    middlewares: [authMiddleware],
  });

export default router;