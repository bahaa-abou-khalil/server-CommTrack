import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(token);

export const getMessages = async (req, res) => {
  try {
    const { channels } = await slackClient.conversations.list();
    const allMessages = [];

    for (const channel of channels) {
      console.log(`Fetching messages from channel: ${channel.name}`);
      
      const { messages } = await slackClient.conversations.history({
        channel: channel.id,
      });

      allMessages.push({
        channelName: channel.name,
        messages: messages,
      });
    }
    
    res.status(200).json({ message: "Messages fetched successfully", data: allMessages });
  } catch (error) {
    console.error(`Error fetching messages: ${error.message}`);
    res.status(500).json({ message: "Error fetching messages from Slack" });
  }
};

export const postMessageToChannel = async (req, res) => {
    const { channelName, message } = req.body;
  
    try {
        if (!channelName || !message){
            return res.status(500).json({
                message: "Missing channel name or message"
            })
        }
        const result = await slackClient.conversations.list();
        const channel = result.channels.find(channel => channel.name === channelName);
    
        if (!channel) {
            return res.status(500).json({ message: "Channel not found" });
        }
    
        await slackClient.chat.postMessage({
            channel: channel.id,
            text: message,
        });
    
        return res.json(
            {   message: "Message posted successfully",
                channel: channelName, 
                text: message 
            });

    } catch (error) {
        console.error(`Error posting message: ${error.message}`);
        res.status(500).json({ message: "Error posting message to Slack" });
    }
  };
