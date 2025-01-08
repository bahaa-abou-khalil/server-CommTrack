import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import { getUserAlerts } from "./alerts.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const alertsRouter = new Router();

alertsRouter.post("/",getUserAlerts)

const router = new AppRouter({
    prefix: "/alerts",
    router: alertsRouter,
    middlewares: [],
  });

export default router;