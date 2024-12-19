import { Router } from "express";
import {
    createChannel
} from "../../controllers/slack/channels.controller.js"

const router = new Router();

router.post("/", createChannel);

export default router;