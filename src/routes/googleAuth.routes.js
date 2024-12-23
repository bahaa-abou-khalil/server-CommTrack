import { Router } from "express";
import "../middleware/googleAuth.js";
import { 
    authenticateGoogle, redirectAuth, callbackSuccess , callbackFailure
    } from "../middleware/googleAuth.js";

import {
    isLoggedIn
} from "../middleware/auth.middleware.js";

const router = new Router();

router.get("/",authenticateGoogle);

router.get( '/google/callback', redirectAuth);

router.get('/callback/success' , callbackSuccess);

router.get('/callback/failure' , callbackFailure);

export default router;