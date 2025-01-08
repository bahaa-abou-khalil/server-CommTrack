import { slackClient } from "../../index.js";


export const getMessages = async (channelId) => {

  try {
    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is required" });
    }

    const response = await slackClient.conversations.history({
      channel: channelId,
      limit: 100,
    });

    const filteredMessages = response.messages.filter(
      (msg) => !msg.subtype && msg.user && msg.text && msg.ts
    );

    const formattedMessages = filteredMessages.map((msg) => ({
      user: msg.user,
      text: msg.text,
      timestamp: msg.ts,
    }));

    res.status(200).json({
      messages: formattedMessages,
    });
  } catch (error) {
    console.error(`Error fetching messages: ${error.message}`);
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};