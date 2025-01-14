import { Discussion } from "../../db/models/discussion.model.js";
import { User } from "../../db/models/user.model.js";

export const getLeaderBoard= async (req,res) => {
    try{

        const users = await User.find();

        const usersStats = []

        for (const user of users) {
            const totalAlerts = user.alerts.length;

            const discussions = await Discussion.find({ "joinedUsers.user": user.id });
            const totalDiscussions = discussions.length;
            usersStats.push({
                avatar: user.profilePicture,
                name: user.fullName,
                email: user.email,
                discussions: totalDiscussions,
                alerts: totalAlerts
            })

        }

        res.status(200).json(usersStats)
    }catch(error){
        console.log(`error in leader board : ${error}`);
        res.status(500).json({
            message: 'Error occured.'
        })
    }

}