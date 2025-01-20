import { User } from "../../db/models/user.model.js";


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