import { slackClient } from "../../index.js";

export const getMessages = async (req, res) => {
  const { channelId } = req.params;

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
