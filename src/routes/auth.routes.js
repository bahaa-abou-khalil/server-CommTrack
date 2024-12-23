import { Router } from "express";
import {
  signUp,
  signIn
} from "../controllers/auth.controller.js";

import {
    sessionChecker
} from "../middleware/googleAuth.js"
const router = new Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);

router.get('/dashboard', sessionChecker, (req, res) => {
res.send(`Welcome, User ${req.session.userId}`);
});

export default router;
