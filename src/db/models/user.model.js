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
        role: {
            type:String,
            enum:["admin", "leader", "member"]
        }, 
        alerts: [alertSchema],

}
)

export const User = model("User", userSchema)