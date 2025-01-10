import { User } from "../../db/models/user.model.js";
import { Discussion } from "../../db/models/discussion.model.js";

export const trackStoreJoin = async (req, res) => {
    try {
        const { event } = req.body;

        if (event.type === "member_joined_channel") {
            const channelId = event.channel;
            const userId = event.user;

            const discussion = await Discussion.findOne({ channelId });
            if (!discussion) {
                return res.status(500).json({ message: "Discussion not found for this channel." });
            }

            const user = await User.findOne({ slackUserID: userId });
            if (user) {
                user.joinedDiscussions.push(discussion._id);
                await user.save();
            }

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