import express from "express";
import connectToDatabase from "./db/connection.js";
import { init, registerRoutes } from "./config/init.js";
import traditionalAuthRouter from "./modules/traditionalAuth/auth.routes.js";
import slackAuthRouter from "./modules/slackAuth/auth.routes.js"
import googleAuthRouter from "./modules/googleAuth/auth.routes.js"
import channelsRouter from "./modules/channels/channels.routes.js"
import installRouter from "./modules/install/install.routes.js"
import messagesRouter from "./modules/messages/messages.routes.js"
import discussionsRouter from "./modules/discussions/discussions.routes.js"
import usersRouter from "./modules/users/users.routes.js"
import openAIRouter from "./modules/openAI/openAI.routes.js"
import alertsRouter from "./modules/alerts/alerts.routes.js"
import eventsRouter from "./modules/events/events.routes.js"
import { WebClient } from "@slack/web-api";
import OpenAI from "openai";
import socketIo from 'socket.io';


const app = express();

init(app);

const token = process.env.SLACK_BOT_TOKEN;

export const slackClient = new WebClient(token);
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const io = socketIo(app);

registerRoutes(app, traditionalAuthRouter, slackAuthRouter, 
              googleAuthRouter, channelsRouter, installRouter,
              messagesRouter, discussionsRouter, usersRouter,
              openAIRouter, alertsRouter, eventsRouter);  

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);

  connectToDatabase();
});