import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

const alertsRouter = new Router();


const router = new AppRouter({
    prefix: "/alerts",
    router: alertsRouter,
    middlewares: [],
  });

export default router;