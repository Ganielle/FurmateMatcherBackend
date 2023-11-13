const Users = require("../models/User")

exports.login = (req, res) => {
    const { username, password } = req.body

    Users.findOne({ username: username, password: password})
    .then(user => {
        if (!user){
            return res.json({message: "failed", data: "User not found! Please check your input credentials"})
        }

        return res.json({message: "success", data: user})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}