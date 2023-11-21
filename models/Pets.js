const mongoose = require("mongoose")

const petsModels = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        adoptedby: {
            type: mongoose.Schema.Types.ObjectId,
            require: false
        },
        name: {
            type: String
        },
        type: {
            type: String
        },
        gender: {
            type: String
        },
        breed: {
            type: String
        },
        age: {
            type: String
        },
        personalitytraits: [{
            type: String
        }],
        special: {
            type: String
        },
        maintenance: {
            type: String
        },
        located: {
            type: String
        },
        picture: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Pets = mongoose.model("Pets", petsModels);

module.exports = Pets;