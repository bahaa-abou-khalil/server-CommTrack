import { User } from "../../db/models/user.model.js";
import { Discussion } from "../../db/models/discussion.model.js";
import { io } from "../../index.js";
import { slackClient } from "../../index.js";

export const trackStoreJoin = async (req, res) => {
    try {
        const { event } = req.body;

        if (event.type === "member_joined_channel") {
            const channelId = event.channel;
            const slackUserID = event.user;

            const discussion = await Discussion.findOne({ channelId });
            if (!discussion) {
                return res.status(500).json({ message: "Discussion not found." });
            }

            const user = await User.findOne({ slackUserID })
            if (!user) {
                return res.status(500).json({ message: "User not found." });
            }

            if (!discussion.joinedUsers.some(joinedUser => joinedUser.user.toString() === user._id.toString())) {
                discussion.joinedUsers.push({ user: user._id });
            }
            await discussion.save();

            const discussions = await Discussion.find().populate({
                path: "createdBy",
                select: "profilePicture fullName",
            })



            io.emit('usersUpdated', discussions);
            console.log("emitted")

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

export const feedbackForm = async (req, res) => {
    const payload = req.body.payload ? JSON.parse(req.body.payload) : null;

    if (!payload) {
        console.log('invalid payload')
        res.status(400).send('Invalid payload');
        return;
    }
  
    try {
      if (payload.type === 'block_actions') {
        const action = payload.actions[0];
        const user = payload.user.id;
  
        console.log(`User ${user} clicked:`, action.value);
  
        if (action.value === 'question_1') {
          await slackClient.chat.postEphemeral({
            channel: payload.channel.id,
            user,
            text: 'Please provide your answer to Question 1:',
          });
        } else if (action.value === 'question_2') {
          await slackClient.chat.postEphemeral({
            channel: payload.channel.id,
            user,
            text: 'Please provide your answer to Question 2:',
          });
        } else if (action.value === 'question_3') {
          await slackClient.chat.postEphemeral({
            channel: payload.channel.id,
            user,
            text: 'Please provide your answer to Question 3:',
          });
        }
  
        res.sendStatus(200);
      }
    } catch (error) {
      console.error(`Error handling interaction: ${error}`);
      res.sendStatus(500);
    }
  };