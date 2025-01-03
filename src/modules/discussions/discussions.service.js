import { slackClient } from "../../index.js";

export const formatDate = (timestamp) =>{
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

export const scheduleDiscussion = (minutes) => {

    let endTime = null;
    if (minutes) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + minutes);
        endTime = now;
    }

    if (endTime) {
        schedule.scheduleJob(endTime, async () => {
            try {
                await slackClient.conversations.archive({ channel: channelId });
                console.log(`Channel ${channelId} has been archived.`);
            } catch (archiveError) {
                console.error(`Failed to archive channel: ${archiveError.message}`);
            }
        });
    }
}
