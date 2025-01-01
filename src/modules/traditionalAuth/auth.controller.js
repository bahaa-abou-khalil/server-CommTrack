import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailValidator from 'email-validator';
import { validatePassword } from "./auth.service.js";

export const signUp = async (req, res) => {
    const { fName, lName, email, password } = req.body;
    
    try {
      if (!fName || !lName || !email || !password) {
        return res.status(500).send({
          message: "All feilds are required",
        });
      }

      const validEmail = emailValidator.validate(email);
      const {errorMessage, validPassword} = validatePassword(password);

      if(!validEmail ){
        return res.status(500).send({
            message: "Please provide a valid email.",
          });   
      }
      else if(!validPassword){
        return res.status(500).send({
            message: "Please provide a valid password.",
            reason: String(errorMessage),
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

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
        email,
        });

        if (!user) {
            return res.status(404).send({
                message: "Invalid Credentials",
        });
        }

        const check = await bcrypt.compare(password, user.password);

        if (!check) {
        return res.status(400).send({
            message: "Invalid Credentials",
        });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        return res.status(200).send({ user, token });
    } catch (error) {
        console.log(error.message);

        return res.status(500).send({
        message: "Something went wrong",
        });
    }
};  


