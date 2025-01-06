import { User } from "../../db/models/user.model.js";
import { slackClient } from "../../index.js";

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

export const createUser = async (req,res)=>{
    const {name, email} = req.body;
    try{
        if (!name || !email){
            res.status(500).send({
                message:"name or email missing"
            })
        }

        const user = await User.create({
            name:name,
            email:email
        })

        return res.json(user);
    }
    catch(error){
        console.log(`Error occured: ${error}`);
        res.status(500).send({
            message: "Somthing went wrong."
        })
    }
}

export const getSlackUsersByIds = async (req, res) => {
    try {
      const { userIds } = req.body;
  
      if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ message: "channelId and a list of userIds are required." });
      }
    
      const usersInfo = await Promise.all(
        userIds.map(async (userId) => {
          const userInfo = await slackClient.users.info({ user: userId });
          return {
            name: userInfo.user.real_name,
            avatar: userInfo.user.profile.image_192,
          };
        })
      );
  
      return res.json({
        users: usersInfo,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to retrieve users information." });
    }
};