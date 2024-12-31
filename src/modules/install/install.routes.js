import { Router } from "express";
import {
    installSlack,
    callback
} from "../../controllers/slack/install.controller.js"

const router = new Router();

router.get("/", installSlack);
router.get("/oauth/callback",callback)

export default router;