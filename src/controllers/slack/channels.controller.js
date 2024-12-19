import { WebClient } from "@slack/web-api";
import { channel } from "diagnostics_channel";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(token);

export const createChannel = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;

    if (!name) {
      return res.status(500).json({ message: "Channel name is required." });
    }

    const response = await slackClient.conversations.create({
      name: name,
      is_private: isPrivate || false,
    });

    return res.json({
      message: "Channel created successfully.",
      channel: response,
    });
  } catch (error) {
    console.error(`Error creating channel: ${error.message}`);
    return res.status(500).json({
      message: "Failed to create channel.",
      error: error,
    });
  }
};

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
