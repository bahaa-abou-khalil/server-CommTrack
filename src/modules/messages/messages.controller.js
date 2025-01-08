import { slackClient } from "../../index.js";

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
