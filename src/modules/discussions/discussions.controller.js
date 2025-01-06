import { slackClient } from "../../index.js";
import { formatDate, getUserDetails } from "./discussions.service.js";
import { scheduleDiscussion } from "./discussions.service.js";
import { User } from "../../db/models/user.model.js";

export const getAllDiscussions = async (req, res) => {

    const slackUserID = req.user.slackUserID;

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
                const createdAtTimestamp = channelInfo.channel.created;
                const createdAt = formatDate(createdAtTimestamp);
                const membersResponse = await slackClient.conversations.members({
                    channel: channelId,
                });

                const users = membersResponse.members || [];

                const usersCount = users.length;
    
                let status = "pending";
                if (usersCount > 2) {
                    status = "active";
                } else if (usersCount <= 1) {
                    status = "closed";
                }

                const userDetails = await getUserDetails(slackUserID);
                
                
                appCreatedChannels.push({
                    channelId,
                    title,
                    description,
                    users,
                    createdAt,
                    status,
                    userDetails
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
      const { title, description, timeLimit } = req.body;
  
      if (!title) {
        return res.status(500).json({ message: "Channel title is required." });
      }
  
      const response = await slackClient.conversations.create({
        name: title,
        is_private: false,
      });
  
      const channelId = response.channel.id;
  
      if (description) {
        await slackClient.conversations.setPurpose({
          channel: channelId,
          purpose: description,
        });
      }

      scheduleDiscussion(timeLimit, channelId)
  
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newDiscussion = { 
        title: title, 
        description: description, 
        timeLimit: timeLimit};

      user.joinedDiscussions.push(newDiscussion);

      await user.save();

      return res.json({
        message: "Channel created successfully.",
        channel: response,
        channelId: channelId,
        discussion: newDiscussion
      });
    } catch (error) {
      console.error(`Error creating channel: ${error.message}`);
      return res.status(500).json({
        message: "Failed to create channel.",
        error: error,
      });
    }
};

export const checkDiscussionStatus = async (req, res) => {
    try {
        const { channelId } = req.params;
        console.log(channelId)
        if (!channelId) {
            return res.status(400).json({ message: "Channel ID is required." });
        }
    
        const membersResponse = await slackClient.conversations.members({
            channel: channelId,
        });
    
        const memberCount = membersResponse.members.length;
    
        let status = "pending";
        if (memberCount > 2) {
            status = "active";
        } else if (memberCount <= 1) {
            status = "closed";
        }
    
        return res.json({
            message: `Channel status: ${status}`,
            status: status,
            memberCount: memberCount,
        });
    } catch (error) {
        console.error(`Error checking channel status: ${error.message}`);
        return res.status(500).json({
            message: "Failed to check channel status.",
            error: error,
        });
    }
};

export const redirectToDiscussion = async (req, res) => {
    const {channelId} = req.params;

    try {
        
        const workspace = await slackClient.team.info();
        const workspaceID = workspace.team.id;       

        const slackChannelUrl = `https://app.slack.com/client/${workspaceID}/${channelId}`;
        res.redirect(slackChannelUrl);

    } catch (error) {
        console.error(`Error redirecting to channel (${channelName}): ${error.message}`);
        res.status(500).json({ message: "Error redirecting to Slack channel" });
    }
};

