const mongoose = require("mongoose")

const petViewHistoryModels = new mongoose.Schema(
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

const PetViewHistory = mongoose.model("PetViewHistory", petViewHistoryModels);

module.exports = PetViewHistory;