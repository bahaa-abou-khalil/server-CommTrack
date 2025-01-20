import { User } from "../../db/models/user.model.js";

const data = {
    "result": "{\"users\":[{\"user_id\":\"U085WU4G7JM\",\"alerts\":[{\"alert_type\":\"behaviour\",\"alert_title\":\"Disrespectful Communication\",\"alert_description\":\"Message tone comes off as rude or belittling.\",\"improvement_tips\":[\"Use positive language in discussions.\",\"Focus on constructive feedback.\",\"Foster a collaborative environment.\"]}]},{\"user_id\":\"U085QQFEDDM\",\"alerts\":[{\"alert_type\":\"behaviour\",\"alert_title\":\"Inappropriate Language\",\"alert_description\":\"Use of offensive language in messages.\",\"improvement_tips\":[\"Choose words carefully in conflict.\",\"Maintain professionalism in communication.\",\"Avoid using offensive language.\"]},{\"alert_type\":\"engagement\",\"alert_title\":\"Negative Attitude\",\"alert_description\":\"Tone suggests reluctance or disinterest in tasks.\",\"improvement_tips\":[\"Communicate your needs clearly.\",\"Seek help when feeling overwhelmed.\",\"Aim to adopt a more positive outlook.\"]}]}]}"
}

export const storeUsersAlerts = async (data) => {
    try {
        const { users } = JSON.parse(data.result);
  

        for (const user of users) {
            const alerts = user.alerts.map(alert => ({
                type: alert.alert_type,
                title: alert.alert_title,
                description: alert.alert_description,
                improvement_tips: alert.improvement_tips,
            }));

    
            const existingUser = await User.findOne({ 
                slackUserID: user.user_id });
    
            if (existingUser) {
                existingUser.alerts = existingUser.alerts.concat(alerts);
                await existingUser.save();
                console.log(`Alerts updated for user: ${user.user_id}`);
            } else {
                console.log(`User not found in database: ${user.user_id}`);
            }
        }
  
    } catch (error) {
        console.error(`Error occured: ${error.message}`);
    }
};
