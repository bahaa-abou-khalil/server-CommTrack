import {Schema} from "mongoose";

export const alertSchema =new Schema({

    type: {
        type: String,
        enum: ["productivity", "engagement", "behaviour"]
    },
    title: String, 
    description: String, 
    improvement_tips: [String], 
    isAcknowledged:{
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default:Date.now
    }, 
    
})
