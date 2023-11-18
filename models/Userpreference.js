const mongoose = require("mongoose")

const userPreferenceModels = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        userdetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserDetails"
        },
        location: {
            type: String
        },
        typeofhome: {
            type: String
        },
        aloneothers: {
            type: String
        },
        ownershipstatus: {
            type: String
        },
        breedowned: {
            type: [String]
        },
        petshave: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const UserPreference = mongoose.model("UserPreference", userPreferenceModels);

module.exports = UserPreference;