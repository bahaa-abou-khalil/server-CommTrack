import express from "express";
import connectDatabase from "./db/connection.js";
import userRoutes from "./routes/users.routes.js";
import messageRoutes from "./routes/slack/messages.routes.js";
import channelRoutes from "./routes/slack/channels.routes.js";
import authRoutes from "./routes/auth.routes.js";
import googleOauthRoutes from "./routes/googleOauth.routes.js";


const app =express();
app.use(express.json());

app.listen(8080,async()=>{
    console.log("Server running on port 8080");
    await connectDatabase();
})

app.use("/users", userRoutes);

app.use("/slack/message",messageRoutes);
app.use("/slack/channel",channelRoutes);

app.use("/googleOauth", googleOauthRoutes)

app.use("/auth", authRoutes)