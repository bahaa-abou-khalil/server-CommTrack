import { Router } from "express";
import {
    installSlack
} from "../../controllers/slack/install.controller.js"

const router = new Router();

router.get("/install", installSlack);

export default router;