import { Router } from "express";
import {
    getMessages,
    postMessageToChannel
} from "../../controllers/slack/messages.controller.js"

const router = new Router();

router.get("/", getMessages);
router.post("/", postMessageToChannel);

export default router;