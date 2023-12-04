const mongoose = require("mongoose")

const likePetModels = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        pet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pets"
        }
    },
    {
        timestamps: true
    }
)

const LikePets = mongoose.model("LikePets", likePetModels);

module.exports = LikePets;