import jwt from "jsonwebtoken";
import { User } from "../db/models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      console.log("auth not in header")
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
  
    const splitted = authHeader.split(" ");
  
    if (splitted.length !== 2 || splitted[0] !== "Bearer") {
      console.log("not bearer")
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
  
    const token = splitted[1];
  
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
  
      const id = payload.userId;
  
      const user = await User.findById(id);
  
      req.user = user;
  
      next();
    } catch (error) {
      console.log(`error in auth: ${error}`)
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
  };
  
  
    
  