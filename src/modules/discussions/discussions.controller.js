import { slackClient } from "../../index.js";
import { formatTimestamp } from "./discussions.service.js";
import { getUserDetails } from "../users/users.service.js";
import { scheduleDiscussionActions } from "./discussions.service.js";
import { User } from "../../db/models/user.model.js";
import { Discussion } from "../../db/models/discussion.model.js";
import { io } from "../../index.js";

export const getDiscussions = async (req,res) => {
    try{

        const discussions = await Discussion.find()
            .populate({
                path: "createdBy",
                select: "profilePicture fullName",
            }).populate({
                path: "joinedUsers.user",
                select: "profilePicture fullName",
            });

        res.json({
            discussions : discussions
        })

    }catch(error){

        console.log(`Error getting discussions: ${error}`)
        res.status(500).json({
            error: "Something went wrong."
        })

    }
}

export const getSlackDiscussions = async (req, res) => {

    try {
        

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
                const createdAt = formatTimestamp(createdAtTimestamp);
                const membersResponse = await slackClient.conversations.members({
                    channel: channelId,
                });

                const slackUsers = membersResponse.members.filter(user => user !== botUserId) || [];
                const usersCount = slackUsers.length;


                let status = "pending";
                if (usersCount > 1) {
                    status = "active";
                } else if (usersCount < 1) {
                    status = "closed";
                }

                const users = [];
                for (const slackUserID of slackUsers) {
                    const userDetails = await getUserDetails(slackUserID);
                    if (userDetails) {
                        users.push(userDetails);
                    }
                }
                
                const timeLimit = description.split('(')[1]?.split(' ')[0] ?? null;

                appCreatedChannels.push({
                    channelId,
                    title,
                    description,
                    createdAt,
                    status,
                    users,
                    timeLimit
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
      const id = req.user.id;
  
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
          purpose: `${description} (${timeLimit} min)`,
        });
    }

    const newDiscussion = new Discussion({ 
        title: title, 
        description: description,
        timeLimit: timeLimit,
        channelId: channelId,
        createdBy: id
    });
    
    await newDiscussion.save();

    await scheduleDiscussionActions(timeLimit, channelId)
  


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
        res.status(200).json({
            slackChannelUrl:slackChannelUrl
        })

    } catch (error) {
        console.error(`Error redirecting to channel (${channelName}): ${error.message}`);
        res.status(500).json({ message: "Error redirecting to Slack channel" });
    }
};

export const getDiscussionMembers = async (req, res) => {
    try {
        const { channelId } = req.params;

        if (!channelId) {
            return res.status(500).send({
                message: "'channelId' is required"
            });
        }

        const membersResponse = await slackClient.conversations.members({
            channel: channelId,
        });
        const authResponse = await slackClient.auth.test();
        const botUserId = authResponse.user_id;

        const slackUsers = membersResponse.members.filter(user => user !== botUserId) || [];
        const usersCount = slackUsers.length;

        const users = [];
        for (const slackUserID of slackUsers) {
            const userInfo = await slackClient.users.info({
                user: slackUserID,
            });
            if (!userInfo.ok) {
                res.status(500).json({
                    message: "Error getting user info",
                })
            }
            const { real_name, profile } = userInfo.user;
            users.push({
                name: real_name,
                avatar: profile.image_192,
            });
        }

        res.json({ users, count: usersCount });

    } catch (error) {
        console.error(`Error getting discussion members: ${error.message}`);
        res.status(500).json({
            message: "An error occurred.",
        });
    }
}

export const getDiscussionsStats = async (req,res) => {
    try {
        const totalUsers = await User.countDocuments();

        if (totalUsers === 0) {
            res.json({ activePercentage: 0, inactivePercentage: 100 });
        }

        const discussions = await Discussion.find();

        let totalJoinedUsers = 0;
        discussions.forEach(discussion => {
            totalJoinedUsers += discussion.joinedUsers.length;
        });

        const averageJoinedUsers = discussions.length > 0 ? totalJoinedUsers / discussions.length : 0;

        const activePercentage = Math.round((averageJoinedUsers / totalUsers) * 100);

        const inactivePercentage = Math.round(100 - activePercentage);

        res.status(200).json({ activePercentage, inactivePercentage });
    } catch (error) {
        console.error(`error in discussions stats: ${error}`);
        res.status(500).json({ activePercentage: 0, inactivePercentage: 100 });
    }
};



