import { Router } from "express";
import {
    signInSlack
} from "../../controllers/slack/signIn.controller.js"

const router = new Router();

router.get("/", signInSlack);

export default router;