import { Router } from "express";
import {
    createUser,
    getUsers
} from "../controllers/users.controller.js"

const router = new Router();

router.get("/:id?", getUsers);
router.post("/",createUser);

export default router;