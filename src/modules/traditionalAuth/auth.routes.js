import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
  signUp,
  signIn
} from "./auth.controller.js";


const authRouter = new Router();

authRouter.post("/signUp", signUp);
authRouter.post("/signIn", signIn);


const router = new AppRouter({
    prefix: "/traditionalAuth",
    router: authRouter,
    middlewares: [],
  });

export default router;
