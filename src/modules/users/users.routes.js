import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    createUser,
    getUsers
    } from "./users.controller.js"
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const usersRouter = new Router();

usersRouter.get("/:id?", getUsers);
usersRouter.post("/",createUser);

const router = new AppRouter({
    prefix: "/users",
    router: usersRouter,
    middlewares: [adminMiddleware],
  });

export default router;