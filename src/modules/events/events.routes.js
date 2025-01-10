import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    trackStoreJoin,
    slackEvents
} from "./events.controller.js";

const eventsRouter = new Router();

eventsRouter.post("/", trackStoreJoin);


const router = new AppRouter({
    prefix: "/events",
    router: eventsRouter,
    middlewares: [],
  });


export default router;