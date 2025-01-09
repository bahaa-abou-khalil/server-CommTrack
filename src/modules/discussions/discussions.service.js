import { slackClient } from "../../index.js";
import schedule from 'node-schedule';
import { analyzeMessages } from "../openAI/openAI.service.js";
import { storeUsersAlerts } from "../alerts/alerts.service.js";
import { getMessages } from "../messages/messages.service.js";

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




