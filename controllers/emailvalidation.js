const EmailValidation = require("../models/Emailvalidation")
const Users = require("../models/User")

exports.emailvalidate = (req, res) => {
    const { id } = req.body

    EmailValidation.findOne({token: id})
    .populate({
        path: "owner",
        select: "activated"
    })
    .then(async email => {
        if (email.activated == true){
            return res.json({message: "failed", data: "You already activated your email. You can now login."})
        }

        await EmailValidation.findOneAndUpdate({token: id}, { activated: true})
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
 
        await Users.findByIdAndUpdate(email.owner._id, {activated: true})
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))

        return res.json({message: "success"})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}