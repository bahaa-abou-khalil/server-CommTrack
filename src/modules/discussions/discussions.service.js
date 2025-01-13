import { slackClient } from "../../index.js";
import schedule from 'node-schedule';
import { analyzeMessages } from "../openAI/openAI.service.js";
import { storeUsersAlerts } from "../alerts/alerts.service.js";
import { getMessages } from "../messages/messages.service.js";
import { Discussion } from "../../db/models/discussion.model.js";

export const formatTimestamp = (timestamp) =>{
    const date = new Date(timestamp * 1000);

    const formattedDate = date.toLocaleString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return formattedDate;
}


const archiveDiscussion = async (channelId) =>{
    try {
        await slackClient.conversations.archive({ channel: channelId });
        console.log(`Channel ${channelId} has been archived.`);
    } catch (archiveError) {
        console.error(`Failed to archive channel: ${archiveError.message}`);
    }
}


export const scheduleDiscussionActions = async (minutes, channelId) => {

    let endTime = null
    if (minutes) {
        endTime = new Date();
        endTime.setTime(endTime.getTime() + (minutes * 60 * 1000));
    }

    if (endTime) {
        schedule.scheduleJob(endTime, async () => {
            const messageResponse = await getMessages(channelId);
            const alertsResponse = await analyzeMessages(messageResponse.messages);
            await storeUsersAlerts(alertsResponse);
            await archiveDiscussion(channelId);
        });
    }
}

const data = {
    "result": "{\"users\":[{\"user_id\":\"U088524PB46\",\"messages_quality\":\"65%\"},{\"user_id\":\"U085WU4G7JM\",\"messages_quality\":\"55%\"}]}"
}

export const storeMessagesRate = async (data, channelId) => { 
    try {
        const { users } = JSON.parse(data.result);

        for (const user of users) {
            const { user_id, messages_quality } = user;

            const existingDiscussion = await Discussion.findOne({ channelId: channelId });

            if (existingDiscussion) {
                const joinedUser = existingDiscussion.joinedUsers.find(u => u.user.toString() === user_id);

                if (joinedUser) {
                    joinedUser.messages_rate = messages_quality;
                    await existingDiscussion.save();
                    console.log(`Updated rate for user: ${user_id}`);
                } else {
                    console.log(`Joined User not found.`);
                }
            } else {
                console.log(`Discussion not found for channelId: ${channelId}`);
            }
        }

    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }
};




