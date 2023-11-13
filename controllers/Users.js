const Users = require("../models/User")
const UserDetails = require("../models/Userdetails")
const Roles = require("../models/Roles")

exports.createuser = (req, res) => {
    const { username, password, firstname, middlename, lastname, gender, dob, street, municipality, province, country, zipcode } = req.body

    Users.findOne({username: username})
    .then(data => {
        if (!data){
            Users.create({ roleId: process.env.USER_ROLE_ID, username: username, password: password})
            .then(user => {
                UserDetails.create({user: user._id, firstname: firstname, lastname: lastname, gender: gender, dob: dob, street: street, municipality: municipality, province: province, country: country, zipcode: zipcode})
                .then(userdetails => {
                    res.json({message: "success"})
                })
                .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
            })
            .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
        }
        else{
            return res.json({ message: "failed", data: "User already exist"})
        }
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}