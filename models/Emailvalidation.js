const mongoose = require("mongoose")

const emailValidationModels = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        token: {
            type: String
        },
        activated: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const EmailValidation = mongoose.model("EmailValidation", emailValidationModels);

module.exports = EmailValidation;