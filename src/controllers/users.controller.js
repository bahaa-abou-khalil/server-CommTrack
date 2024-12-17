import { User } from "../models/user.model.js";

export const getUsers = async (req,res)=>{
    const id= req.params.id;

    try{
        if(id){
            const user = await User.findById(id);
    
            if(!user){
                res.status(404).send({
                    message:"user not found"
                })
            }
    
            return res.json(user);
        }
    
        const users = await User.find();
    
        return res.json(users);
    }
    catch(error){
        console.log(`Error in Users controller (getUsers): ${error.message}`)
        res.status(500).send({
            message: "Something went wrong."
        })
    }

}