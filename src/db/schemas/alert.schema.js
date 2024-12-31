import {Schema, model} from "mongoose";

const alertSchema =new Schema({

    type: {
        type: String,
        enum: ["productivity", "engagement", "behavior"]
    },
    title: String, 
    description: String, 
    reason: String, 
    date: {
        type: Date,
        default:Date.now
    }, 
    improvement_tips: [String], 
    channel: String
    
})

export const User = model("Alert", alertSchema)