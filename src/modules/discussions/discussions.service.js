import { slackClient } from "../../index.js";
import schedule from 'node-schedule';
import { User } from "../../db/models/user.model.js";
import { parse, format } from 'date-fns';

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

export const scheduleTimeDiscussion = (minutes, channelId = null) => {

    let endTime = null
    if (minutes) {
        endTime = new Date();
        endTime.setTime(endTime.getTime() + (minutes * 60 * 1000));
        console.log(endTime)
        
        
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

export const getUserDetails = async (slackUserID) => {
    try {
        const user = await User.findOne({ slackUserID }).select('fullName profilePicture slackUserID');
        
        if (!user) {
            throw new Error('User not found');
        }

        return { name: user.fullName, avatar: user.profilePicture, slackUserID: user.slackUserID };
    } catch (error) {
        throw new Error(error.message);
    }
};