const mongoose = require("mongoose")

const petPreferenceModels = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        located: {
            type: String
        },
        typepet:{
            type: String
        },
        genderpet: {
            type: String
        },
        agepet: {
            type: String
        },
        specialdogs: {
            type: String
        },
        breedpet: {
            type: [String]
        },
        personalitytraits: {
            type: [String]
        },
        petmaintenance: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const PetPreference = mongoose.model("PetPreference", petPreferenceModels);

module.exports = PetPreference;