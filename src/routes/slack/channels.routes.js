import { Router } from "express";
import {
    createChannel,
    getChannels
} from "../../controllers/slack/channels.controller.js"

const router = new Router();

router.post("/", createChannel);
router.get("/", getChannels);

export default router;