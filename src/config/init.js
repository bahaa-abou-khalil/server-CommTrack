import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";

export const init = (app) => {
    dotenv.config();

    app.use(express.json());

    app.use(
        cors({
        origin: "*",
        })
    );


    app.use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        resave:true
    }))

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(cookieParser());

};

export const registerRoutes = (app, ...routers) => {
  routers.forEach((customedRouter) => {
    app.use(
      customedRouter.prefix,
      ...customedRouter.middlewares,
      customedRouter.router
    );
  });
};
