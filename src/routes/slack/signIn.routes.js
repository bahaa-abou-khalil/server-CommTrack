import { Router } from "express";
import {
    signInSlack,
    signInCallback
} from "../../controllers/slack/signIn.controller.js"

const router = new Router();

router.get("/", signInSlack);
router.get("/welcome", signInCallback);

export default router;