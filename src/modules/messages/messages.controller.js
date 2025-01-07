import { slackClient } from "../../index.js";

export const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (channelId) {
      const response = await slackClient.conversations.history({
        channel: channelId,
        limit: 100,
      });
      return res.status(200).json({
        messages: response.messages,
      });
    }

    // const { channels } = await slackClient.conversations.list();
    // if (!channels || channels.length === 0) {
    //   return res.status(404).json({ message: "No channels found" });
    // }

    // const allMessages = await Promise.all(
    //   channels.map(async (channel) => {
    //     const { messages } = await slackClient.conversations.history({
    //       channel: channel.id,
    //       limit: 100,
    //     });

    //     return {
    //       channelName: channel.name,
    //       messages,
    //     };
    //   })
    // );

    // res.status(200).json({
    //   allMessages: allMessages
    // });
  } catch (error) {
    console.error(`Error getting messages: ${error.message}`);
    res.status(500).json({ message: "Error getting messages from Slack", error: error.message });
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
