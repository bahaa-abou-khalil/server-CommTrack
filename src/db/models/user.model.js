import {Schema, model} from "mongoose";


const discussionSchema = new Schema({

    title: String, 
    description: String, 
    status: {
        type:String,
        enum:["active","pending"]
    },
    date: {
        type:Date,
        default:Date.now
    }, 
    channel: String, 
    time_limit: Number
})

const userSchema = new Schema({
 
        firstName: {
            type: String,
            required: true
        }, 
        lastName: {
            type: String,
            required: true
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
            required: true,
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