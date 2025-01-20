import { slackClient } from "../../index.js";

export const getMessages = async (channelId) => {
  try {
    if (!channelId) {
        return { 
            message: "Channel ID is required" 
        };
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
    return {
        messages: formattedMessages,
    };
  } catch (error) {
    console.error(`Error fetching messages: ${error.message}`);
    return {
        message: "Error fetching messages", error: error.message 
    };
  }
};