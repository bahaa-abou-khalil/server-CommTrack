import {Schema, model} from "mongoose";
import { alertSchema } from "../schemas/alert.schema.js";
import { discussionSchema } from "../schemas/discussion.schema.js";

const userSchema = new Schema({
 
        firstName: {
            type: String,
        }, 
        lastName: {
            type: String,
        }, 
        fullName: {
            type: String,
        },
        profilePicture: {
            type: String
        },
        slackTeamID: {
            type: String
        },
        slackUserID: {
            type: String
        },

        email: {
            type: String,
            unique : true
        },
        password: {
            type:String
        }, 
        googleID: {
            type:String 
        },
        tokens: {
            accessToken: {
                type: String,
            }
        },
        role: {
            type:String,
            enum:["admin", "leader", "member"]
        }, 
        slackWorkspace: {
            type: String
        }, 
        alerts: [alertSchema],
        joinedDiscussions:[discussionSchema]
}
)

export const User = model("User", userSchema)