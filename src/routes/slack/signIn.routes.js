import { Router } from "express";
import {
    signInWithSlack
} from "../../controllers/slack/signIn.controller.js"

const router = new Router();

router.get("/", signInWithSlack);

export default router;