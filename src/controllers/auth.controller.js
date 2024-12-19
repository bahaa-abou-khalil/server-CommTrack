import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
    const { fName, lName, email, password } = req.body;
  
    try {
      if (!fName || !lName || !email || !password) {
        return res.status(500).send({
          message: "All feilds are required",
        });
      }
  
      const hashed = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        firstName: fName,
        lastName: lName,
        email: email,
        password: hashed
      });
  
      return res.json(user);
    } catch (error) {
      console.log(error.message);
  
      return res.status(500).send({
        message: "Something went wrong",
      });
    }
  };
