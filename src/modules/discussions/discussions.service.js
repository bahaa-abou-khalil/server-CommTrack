import { slackClient } from "../../index.js";
import schedule from 'node-schedule';

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

export const scheduleDiscussion = (minutes,channelId = null) => {

    let endTime = null;
    if (minutes) {
        console.log("minutes",minutes)
        const utcDate = new Date();
        const offset = 2 * 60;
        const now = new Date(utcDate.getTime() + offset * 60 * 1000);
        const dateNow = new Date(now);
        endTime = dateNow.setMinutes(dateNow.getMinutes() + 1);
        console.log("endTime1",endTime)
    }

    if (endTime) {
        console.log("endtime",endTime)
        const date = new Date(Date.now() + 5000);
        console.log(date) 
        schedule.scheduleJob(date, () => {
            try {
                // await slackClient.conversations.archive({ channel: channelId });
                console.log(`Channel ${channelId} has been archived.`);
            } catch (archiveError) {
                console.error(`Failed to archive channel: ${archiveError.message}`);
            }
        });
    }
}
