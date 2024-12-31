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

export const User = model("Discussion", discussionSchema)