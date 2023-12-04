const mongoose = require("mongoose")

const roomChatModels = new mongoose.Schema(
    {
        participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }],
        roomname: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Roomchat = mongoose.model("Roomchat", roomChatModels);

module.exports = Roomchat;