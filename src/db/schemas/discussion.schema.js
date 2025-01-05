import {Schema, model} from "mongoose";


export const discussionSchema = new Schema({

    title: String, 
    description: String, 
    status: {
        type:String,
        default: "pending",
        enum:["active","pending"]
    },
    date: {
        type:Date,
        default: Date.now
    },  
    timeLimit: Number
})
