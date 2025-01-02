import { slackClient } from "../../index.js";

export const getChannels = async (req,res)=>{
    try{
        const { channels } = await slackClient.conversations.list();
        res.status(200).json({ message: "Channels fetched successfully", data: channels });

    }
    catch(error){
        console.log(`Error listing channels: ${error.message}`);
        return res.status(500).json({
            message:"Failed to list channels.",
            error:error
        })
    }
}



