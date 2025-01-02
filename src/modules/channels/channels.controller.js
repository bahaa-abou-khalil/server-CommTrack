import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_BOT_TOKEN;
const slackClient = new WebClient(token);

export const createChannel = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;

    if (!name) {
      return res.status(500).json({ message: "Channel name is required." });
    }

    const response = await slackClient.conversations.create({
      name: name,
      is_private: isPrivate || false,
    });

    const channelId = response.channel.id;

    return res.json({
      message: "Channel created successfully.",
      channel: response,
      channelId : channelId
    });
  } catch (error) {
    console.error(`Error creating channel: ${error.message}`);
    return res.status(500).json({
      message: "Failed to create channel.",
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

