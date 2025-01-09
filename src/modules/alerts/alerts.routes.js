import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import { getUserAlerts } from "./alerts.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const alertsRouter = new Router();

alertsRouter.get("/",getUserAlerts)

const router = new AppRouter({
    prefix: "/alerts",
    router: alertsRouter,
    middlewares: [authMiddleware],
  });

export default router;