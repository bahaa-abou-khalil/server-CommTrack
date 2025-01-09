import {Schema, model} from "mongoose";
import { alertSchema } from "../schemas/alert.schema.js";

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
        joinedDiscussions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Discussion",
            },
        ],
}
)

export const User = model("User", userSchema)