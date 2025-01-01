import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import { 
    authenticateGoogle, 
    redirectAuth, 
    callbackSuccess, 
    callbackFailure
    } from "./auth.controller.js";


const authRouter = new Router();

authRouter.get('/',authenticateGoogle);
authRouter.get( '/callback', redirectAuth);
authRouter.get('/callback/success' , callbackSuccess);
authRouter.get('/callback/failure' , callbackFailure);

const router = new AppRouter({
    prefix: "/google",
    router: authRouter,
    middlewares: [],
  });

export default router;