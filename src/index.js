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
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();

init(app);

const token = process.env.SLACK_BOT_TOKEN;

export const slackClient = new WebClient(token);
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('frontend connection');
    
  socket.on('disconnect', () => {
    console.log('frontend disconnected');
  });
});

registerRoutes(app, traditionalAuthRouter, slackAuthRouter, 
              googleAuthRouter, channelsRouter, installRouter,
              messagesRouter, discussionsRouter, usersRouter,
              openAIRouter, alertsRouter, eventsRouter);  

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);

  connectToDatabase();
});

httpServer.listen('8081', () => {
  console.log(`Socket running on port 8081`);

  connectToDatabase();
});