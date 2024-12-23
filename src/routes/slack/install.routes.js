import { Router } from "express";
import {
    installSlack
} from "../../controllers/slack/install.controller.js"

const router = new Router();

router.get("/", installSlack);

export default router;