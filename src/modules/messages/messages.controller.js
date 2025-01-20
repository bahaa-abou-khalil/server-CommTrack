import { slackClient } from "../../index.js";
// import { getMessages } from "./messages.service.js";

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

export const postDiscussionFeedbackForm = async (req, res) => {
    const { channelId } = req.body;
  
    try {
      const message = {
        channel: channelId,
        text: `Feedback Form for Discussion`,
        blocks: [
          {
            type: 'section',
            block_id: 'feedback_form',
            text: {
              type: 'mrkdwn',
              text: `*Please provide feedback for discussion:*`,
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Answer Question 1',
              },
              value: 'question_1',
            },
          },
          {
            type: 'section',
            block_id: 'question_2',
            text: {
              type: 'mrkdwn',
              text: 'What did you like about this discussion?',
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Answer Question 2',
              },
              value: 'question_2',
            },
          },
          {
            type: 'section',
            block_id: 'question_3',
            text: {
              type: 'mrkdwn',
              text: 'Do you have any suggestions for improvement?',
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Answer Question 3',
              },
              value: 'question_3',
            },
          },
        ],
      };
  
      const response = await slackClient.chat.postMessage(message);
  
      res.json({
        message: 'Feedback form sent successfully to Slack channel.',
        data: response,
      });
    } catch (error) {
      console.log(`Error posting feedback form: ${error}`);
      res.status(500).json({
        message: 'Something went wrong while sending the feedback form.',
      });
    }
};

export const getMessages = async (req, res) => {
    try {
      const channelId = req.params.channelId
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
      res.json( {
          messages: formattedMessages,
      });
    } catch (error) {
      console.error(`Error fetching messages: ${error.message}`);
      res.status(500).json( {
          message: "Error fetching messages", error: error.message 
      });
    }
};
