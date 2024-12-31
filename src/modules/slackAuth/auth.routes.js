import { Router } from "express";
import {
    signInWithSlack,
    signInCallback
} from "../../controllers/slack/signIn.controller.js"

const router = new Router();

router.get("/", signInWithSlack);
router.get("/welcome", signInCallback);

export default router;