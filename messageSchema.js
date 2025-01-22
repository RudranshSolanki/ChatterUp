import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

export const MessageModel = mongoose.model('Message', messageSchema);