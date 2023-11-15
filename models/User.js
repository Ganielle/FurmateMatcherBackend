const mongoose = require("mongoose")

const userModels = new mongoose.Schema(
    {
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roles"
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 5
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 5
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

const Users = mongoose.model("Users", userModels);

module.exports = Users;