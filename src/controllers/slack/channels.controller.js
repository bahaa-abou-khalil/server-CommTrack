import { WebClient } from "@slack/web-api";
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
