import { Router } from "express";
import passport from "passport";

import "../middleware/googleAuth.js";
import { 
    authenticateGoogle, redirectAuth, callbackSuccess , callbackFailure
    } from "../middleware/googleAuth.js";

const router = new Router();

router.get("/",authenticateGoogle);

router.get( '/google/callback', redirectAuth);

router.get('/callback/success' , callbackSuccess);

router.get('/callback/failure' , callbackFailure);

export default router;