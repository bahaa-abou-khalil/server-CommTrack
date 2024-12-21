import { Router } from "express";
import {
    googleAuthentication,
    authenticationInfo
} from "../controllers/googleAuth.js"

const router = new Router();

router.get("/",googleAuthentication,authenticationInfo)

export default router;