import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
        installSlack,
        callback
    } from "./install.controller.js"
import { adminMiddleware } from "../../middlewares/admin.middleware.js";


const installRouter = new Router();

installRouter.get("/", installSlack);
installRouter.get("/callback",callback)

const router = new AppRouter({
    prefix: "/install",
    router: installRouter,
    middlewares: [adminMiddleware],
  });

export default router;