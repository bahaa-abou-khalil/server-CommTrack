import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    getSlackDiscussions,
    createDiscussion,
    checkDiscussionStatus,
    redirectToDiscussion,
    getDiscussions,
    trackStoreJoin,
    slackEvents
} from "./discussions.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";


const discussionsRouter = new Router();

discussionsRouter.get("/", getDiscussions);
discussionsRouter.get("/events", trackStoreJoin);
discussionsRouter.post("/", createDiscussion);
discussionsRouter.get("/status/:channelId", checkDiscussionStatus);
discussionsRouter.get("/redirect/:channelId", redirectToDiscussion);
discussionsRouter.post('/events', slackEvents);

const router = new AppRouter({
    prefix: "/discussions",
    router: discussionsRouter,
    middlewares: [authMiddleware],
  });

export default router;