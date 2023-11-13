const Roles = require('../models/Roles')

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
    ];
    roles.map(async role => {
        await Roles.create(role);
    });

    res.json("migration created");
};