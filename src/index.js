import express from "express";
import connectDatabase from "./db/connection.js";
import userRoutes from "./routes/users.routes.js";
import messageRoutes from "./routes/slack/messages.routes.js";
import channelRoutes from "./routes/slack/channels.routes.js";
import installRoutes from "./routes/slack/install.routes.js";
import authRoutes from "./routes/auth.routes.js";
import googleAuthRoutes from "./routes/googleAuth.routes.js";
import signInSlackRoutes from "./routes/slack/signIn.routes.js";
import session from "express-session";
import passport from "passport";
import cors from "cors"

const app =express();


app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave:true
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());

app.use(cors());

app.listen(8080,async()=>{
    console.log("Server running on port 8080");
    await connectDatabase();
})

app.use("/users", userRoutes);

app.use("/slack/message",messageRoutes);
app.use("/slack/channel",channelRoutes);
app.use("/slack/install", installRoutes)
app.use("/slack/signIn", signInSlackRoutes)

app.use("/", googleAuthRoutes)

app.use("/auth", authRoutes)