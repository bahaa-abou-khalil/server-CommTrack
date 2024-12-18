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
