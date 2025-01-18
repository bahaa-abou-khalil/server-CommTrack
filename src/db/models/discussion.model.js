import {Schema, model} from "mongoose";


export const discussionSchema = new Schema({

    title: String, 
    description: String, 
    timeLimit: Number,
    channelId : String,
    isPinned : {
        type: Boolean,
        default: false
    },
    createdBy : {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    joinedUsers: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            messages_rate: {
                type: String,
            },
        },
    ],
    status: {
        type:String,
        default: "pending",
        enum:["active","pending"]
    },
    date: {
        type:Date,
        default: Date.now
    },  
    
})

export const Discussion = model("Discussion", discussionSchema)