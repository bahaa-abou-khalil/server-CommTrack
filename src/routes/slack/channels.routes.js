import { Router } from "express";
import {
    createChannel,
    getChannels,
    redirectToChannel
} from "../../controllers/slack/channels.controller.js"

const router = new Router();

router.post("/", createChannel);
router.get("/", getChannels);
router.get("/redirect/:channelName", redirectToChannel);

export default router;