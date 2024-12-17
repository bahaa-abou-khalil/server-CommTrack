import express from "express";
import connectDatabase from "./db/connection.js";

const app =express();
app.use(express.json());

app.listen(8080,async()=>{
    console.log("Server running on port 8080");

    connectDatabase();
})