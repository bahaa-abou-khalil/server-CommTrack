import { WebClient } from "@slack/web-api";

export const getAllDiscussions = async (req, res) => {
    const token = process.env.SLACK_BOT_TOKEN;
    const slackClient = new WebClient(token);
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

            const membersResponse = await slackClient.conversations.members({
                channel: channelId,
            });

            const users = membersResponse.members || [];

            appCreatedChannels.push({
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