const mongoose = require("mongoose")

const rescuerDetailsModels = new mongoose.Schema(
    {
        email: {
            type: String
        },
        street: {
            type: String
        },
        municipality: {
            type: String
        },
        province: {
            type: String
        },
        country: {
            type: String
        },
        zipcode: {
            type: String
        },
        vision: {
            type: String
        },
        mission: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const RescuerDetails = mongoose.model("RescuerDetails", rescuerDetailsModels);

module.exports = RescuerDetails;