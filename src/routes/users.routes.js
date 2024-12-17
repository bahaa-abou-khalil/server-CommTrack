import { Router } from "express";
import {
    getUsers
} from "../controllers/users.controller.js"

const router = new Router();

router.get("/:id?", getUsers);

export default router;