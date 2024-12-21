import { Router } from "express";
import passport from "passport";

import "../middleware/googleAuth.js";
import { authenticateGoogle } from "../middleware/googleAuth.js";
const router = new Router();

router.get("/",authenticateGoogle)

export default router;