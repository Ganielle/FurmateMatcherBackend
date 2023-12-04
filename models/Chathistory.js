const mongoose = require("mongoose")

const chatHistoryModels = new mongoose.Schema(
    {
        roomid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roomchat"
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        content: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const ChatHistory = mongoose.model("ChatHistory", chatHistoryModels);

module.exports = ChatHistory;