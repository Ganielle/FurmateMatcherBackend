const mongoose = require("mongoose")

const petAdoptionRequestModels = new mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        pet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pets"
        },
        status: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const PetAdoptionRequest = mongoose.model("PetAdoptionRequest", petAdoptionRequestModels);

module.exports = PetAdoptionRequest;