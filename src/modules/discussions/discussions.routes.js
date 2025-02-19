import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    getSlackDiscussions,
    createDiscussion,
    checkDiscussionStatus,
    redirectToDiscussion,
    getDiscussions,
    getDiscussionMembers,
    getDiscussionsStats,
    pinDiscussion,
    toggleChannelPrivacy
    } from "./discussions.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";


const discussionsRouter = new Router();

discussionsRouter.get("/members/:channelId", getDiscussionMembers);
discussionsRouter.get("/", getDiscussions);
discussionsRouter.get("/status/:channelId", checkDiscussionStatus);
discussionsRouter.get("/redirect/:channelId", redirectToDiscussion);
discussionsRouter.get("/stats", getDiscussionsStats);
discussionsRouter.post("/", createDiscussion);
discussionsRouter.post("/privacy", toggleChannelPrivacy);

discussionsRouter.post("/pin", pinDiscussion);

const router = new AppRouter({
    prefix: "/discussions",
    router: discussionsRouter,
    middlewares: [authMiddleware],
  });


export default router;