import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(token);

export const createChannel = async (req, res) => {
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


export const checkChannelStatus = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is required." });
    }

    const membersResponse = await slackClient.conversations.members({
      channel: channelId,
    });

    const memberCount = membersResponse.members.length;

    let status = "pending";
    if (memberCount > 1) {
      status = "active";
    } else if (memberCount === 0) {
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


export const getChannels = async (req,res)=>{
    try{
        const { channels } = await slackClient.conversations.list();
        res.status(200).json({ message: "Channels fetched successfully", data: channels });

    }
    catch(error){
        console.log(`Error listing channels: ${error.message}`);
        return res.status(500).json({
            message:"Failed to list channels.",
            error:error
        })
    }
}

export const redirectToChannel = async (req, res) => {
    const {channelName} = req.params;

    try {
        
        const workspace = await slackClient.team.info();
        const workspaceID = workspace.team.id;

        const result = await slackClient.conversations.list();
        const channel = result.channels.find(channel => channel.name == channelName);

        if (!channel) {
        return res.status(500).json({ message: "Channel not found" });
        }
        

        const slackChannelUrl = `https://app.slack.com/client/${workspaceID}/${channel.id}`;
        res.redirect(slackChannelUrl);

    } catch (error) {
        console.error(`Error redirecting to channel (${channelName}): ${error.message}`);
        res.status(500).json({ message: "Error redirecting to Slack channel" });
    }
};

