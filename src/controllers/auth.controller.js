import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailValidator from 'email-validator';
import passwordValidator from "password-validator";

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

const validatePassword = (password)=>{
    let schema = new passwordValidator();
    schema
    .is().min(6)
    const error = schema.validate(password, { details: true });
    const errorMessage = String(error.map(error => error.message));
    const validPassword = schema.validate(password)
    return {errorMessage, validPassword}
}
