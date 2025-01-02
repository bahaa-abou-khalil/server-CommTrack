import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    getChannels,
    redirectToChannel
} from "./channels.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";


const channelsRouter = new Router();

channelsRouter.get("/", getChannels);
channelsRouter.get("/redirect/:channelName", redirectToChannel);

const router = new AppRouter({
    prefix: "/channels",
    router: channelsRouter,
    middlewares: [authMiddleware],
  });

export default router;