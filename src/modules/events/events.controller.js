import { User } from "../../db/models/user.model.js";
import { Discussion } from "../../db/models/discussion.model.js";
import { io } from "../../index.js";

export const trackStoreJoin = async (req, res) => {
    try {
        const { event } = req.body;
        console.log("Request received with event:", event);
        
        if (event.type === "member_joined_channel") {
            const channelId = event.channel;
            const slackUserID = event.user;

            console.log("Channel ID:", channelId, "User ID:", slackUserID);

            const discussion = await Discussion.findOne({ channelId });
            if (!discussion) {
                console.log("Discussion not found for channel:", channelId);
                return res.status(500).json({ message: "Discussion not found." });
            }

            const user = await User.findOne({ slackUserID });
            if (!user) {
                console.log("User not found for slackUserID:", slackUserID);
                return res.status(500).json({ message: "User not found." });
            }

            discussion.joinedUsers.push(user._id);
            await discussion.save();

            const discussions = await Discussion.find().populate({
                path: "createdBy",
                select: "profilePicture fullName",
            });

            io.emit('usersUpdated', discussions);
            console.log("Discussions updated and emitted to frontend.");

            return res.status(200).send("Member join tracked.");
        }

        res.status(200).send("No events.");
    } catch (error) {
        console.error("Error tracking member join:", error.message);
        return res.status(500).json({ message: "Failed to track member join." });
    }
};

export const slackEvents = (req, res) => {
    const { type, challenge } = req.body;
  
    if (type === 'url_verification') {
        return res.status(200).json({ challenge });
    }
  
    res.status(200).send('Event received');
}