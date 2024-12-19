import { Router } from "express";
import {
    getMessages
} from "../../controllers/slack/messages.controller.js"

const router = new Router();

router.get("/", getMessages);

export default router;