const mongoose = require("mongoose")

const userDetailsModels = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        email: {
            type: String
        },
        firstname: {
            type: String,
        },
        middlename: {
            type: String,
        },
        lastname:{
            type: String
        },
        gender: {
            type: String
        },
        dob: {
            type: String
        },
        street:{
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
        }
    },
    {
        timestamps: true
    }
)

const UserDetails = mongoose.model("UserDetails", userDetailsModels);

module.exports = UserDetails;