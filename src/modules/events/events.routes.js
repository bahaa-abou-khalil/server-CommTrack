import { Router } from "express";
import { AppRouter } from "../../config/AppRouter.js";
import {
    trackStoreJoin,
    slackEvents,
    feedbackForm
} from "./events.controller.js";

const eventsRouter = new Router();

eventsRouter.post("/", trackStoreJoin);
eventsRouter.post("/", slackEvents);
eventsRouter.post("/feedback", feedbackForm);


const router = new AppRouter({
    prefix: "/events",
    router: eventsRouter,
    middlewares: [],
  });


export default router;