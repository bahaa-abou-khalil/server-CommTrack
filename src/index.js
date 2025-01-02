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


const app = express();

init(app);
registerRoutes(app, traditionalAuthRouter, slackAuthRouter, 
              googleAuthRouter, channelsRouter, installRouter,
              messagesRouter, discussionsRouter);  

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);

  connectToDatabase();
});