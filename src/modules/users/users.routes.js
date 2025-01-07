import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    createUser,
    getUsers,
    getSlackUsersByIds,
    getActiveUser
    } from "./users.controller.js"
import { adminMiddleware } from "../../middlewares/admin.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const usersRouter = new Router();


usersRouter.get("/active", getActiveUser);
usersRouter.get("/:id?", getUsers);
usersRouter.post("/",createUser);
usersRouter.post("/slackUsers",getSlackUsersByIds);

const router = new AppRouter({
    prefix: "/users",
    router: usersRouter,
    middlewares: [authMiddleware],
});

export default router;