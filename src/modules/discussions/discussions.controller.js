import { slackClient } from "../../index.js";

export const getAllDiscussions = async (req, res) => {

    try {
        const response = await slackClient.conversations.list();

        if (!response.ok) {
        return res.status(500).json({ message: 'Failed to fetch channels from Slack.' });
        }

        const channels = response.channels;
        const appCreatedChannels = [];

        for (const channel of channels) {
        const channelId = channel.id;

        const channelInfo = await slackClient.conversations.info({
            channel: channelId,
        });

        const authResponse = await slackClient.auth.test();
        const botUserId = authResponse.user_id;

        if (channelInfo.ok) {
            if (channelInfo.channel.creator === botUserId) {
            const title = channelInfo.channel.name;
            const description = channelInfo.channel.purpose.value || 'No description available';
            const channelId = channelInfo.channel.id;

            const membersResponse = await slackClient.conversations.members({
                channel: channelId,
            });

            const users = membersResponse.members || [];

            appCreatedChannels.push({
                channelId,
                title,
                description,
                users,
            });
            }
        }
        }

        return res.json({ discussions: appCreatedChannels });

    } catch (error) {
        console.error('Error fetching Slack channels: ', error.message);
        return res.status(500).json({ message: 'Failed to retrieve discussions from Slack: ', error });
    }
};

export const createDiscussion = async (req, res) => {
    try {
      const { name, isPrivate, description } = req.body;
  
      if (!name) {
        return res.status(500).json({ message: "Channel name is required." });
      }
  
      const response = await slackClient.conversations.create({
        name: name,
        is_private: isPrivate || false,
      });
  
      const channelId = response.channel.id;
  
      if (description) {
        await slackClient.conversations.setPurpose({
          channel: channelId,
          purpose: description,
        });
      }
  
      return res.json({
        message: "Channel created successfully.",
        channel: response,
        channelId: channelId,
      });
    } catch (error) {
      console.error(`Error creating channel: ${error.message}`);
      return res.status(500).json({
        message: "Failed to create channel.",
        error: error,
      });
    }
};