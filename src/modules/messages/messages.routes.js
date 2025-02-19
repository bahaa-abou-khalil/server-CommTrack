import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    postMessageToChannel,
    getMessages,
    postDiscussionFeedbackForm
    } from "./messages.controller.js"
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const messagesRouter = new Router();

messagesRouter.get("/:channelId",getMessages)
messagesRouter.post("/", postMessageToChannel);
messagesRouter.post("/feedback", postDiscussionFeedbackForm);

const router = new AppRouter({
    prefix: "/messages",
    router: messagesRouter,
    middlewares: [authMiddleware],
  });

export default router;