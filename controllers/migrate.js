const Roles = require('../models/Roles')
const Users = require("../models/User")

exports.migrate = (req, res) => {
    
    const roles = [
        {
            _id: "629a98a5a881575c013b5325",
            display_name: "Admin",
            name: "admin",
        },
        {
            _id: "629a98a5a881575c013b5326",
            display_name: "User",
            name: "user",
        },
        {
            _id: "629a98a5a881575c013b5327",
            display_name: "Rescuer",
            name: "rescuer",
        },
        {
            _id: "65525f06019063541ade6d98",
            display_name: "Shelter",
            name: "shelter",
        },
        {
            _id: "65525edd019063541ade6d97",
            display_name: "Organization",
            name: "organization",
        },
    ];
    roles.map(async role => {
        await Roles.create(role);
    });

    Users.create({roleId: process.env.ADMIN_ROLE_ID, username: "admin", password: "dev123", activated: true})

    res.json("migration created");
};