import { Router } from "express";
import passport from "passport";

import "../middleware/googleAuth.js";
import { 
    authenticateGoogle, redirectAuth, callbackSuccess , callbackFailure, sessionChecker
    } from "../middleware/googleAuth.js";

const router = new Router();

router.get("/",authenticateGoogle);

router.get( '/google/callback', redirectAuth);

router.get('/callback/success' , callbackSuccess);

router.get('/callback/failure' , callbackFailure);

// for testing
router.get('/authorized', sessionChecker, (req, res) => {
    res.send(`Welcome, User`);
    });

export default router;