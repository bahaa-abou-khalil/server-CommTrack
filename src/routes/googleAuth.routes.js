import { Router } from "express";
import "../controllers/googleOauth/passport.js";
import { 
    authenticateGoogle, redirectAuth, callbackSuccess , callbackFailure
    } from "../controllers/googleOauth/googleAuth.controller.js";

import {
    isLoggedIn
} from "../middleware/auth.middleware.js";

const router = new Router();

router.get("/",authenticateGoogle);

router.get( '/google/callback', redirectAuth);

router.get('/callback/success' , callbackSuccess);

router.get('/callback/failure' , callbackFailure);

export default router;