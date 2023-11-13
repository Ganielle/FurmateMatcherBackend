const mongoose = require("mongoose")

const roleModels = new mongoose.Schema(
    {
        display_name: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Roles = mongoose.model("Roles", roleModels);

module.exports = Roles;