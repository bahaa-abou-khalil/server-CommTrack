import express from "express";
import connectDatabase from "./db/connection.js";
import userRoutes from "./routes/users.routes.js";
import slackRoutes from "./routes/slack.routes.js";


const app =express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/slack",slackRoutes)
app.listen(8080,async()=>{
    console.log("Server running on port 8080");
    connectDatabase();
})