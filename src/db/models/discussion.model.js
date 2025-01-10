import {Schema, model} from "mongoose";


export const discussionSchema = new Schema({

    title: String, 
    description: String, 
    timeLimit: Number,
    channelId : String,
    createdBy : {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    joinedUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
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