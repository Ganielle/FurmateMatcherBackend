const Users = require("../models/User")
const UserDetails = require("../models/Userdetails")
const RescuerDetails = require("../models/Rescuerdetails")
const EmailValidation = require("../models/Emailvalidation")
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2');
const smtpTransport = require('nodemailer-smtp-transport');

exports.createuser = (req, res) => {
    const { username, password, email, firstname, middlename, lastname, gender, dob, street, municipality, province, country, zipcode } = req.body

    UserDetails.findOne({$or: [{firstname: firstname, middlename: middlename, lastname: lastname}, {email: email}]})
    .then(userdeets => {
        if (userdeets){
            return res.json({ message: "failed", data: "User full name/email already exist"})
        }
        else{
            Users.findOne({ username: username})
            .then(data => {
                if (!data){
                    Users.create({ roleId: process.env.USER_ROLE_ID, username: username, password: password})
                    .then(user => {
                        UserDetails.create({user: user._id, firstname: firstname, lastname: lastname, gender: gender, dob: dob, street: street, municipality: municipality, province: province, country: country, zipcode: zipcode, email: email})
                        .then(async userdetails => {

                            const verificationId = nanoid(10)

                            EmailValidation.create({owner: user._id, token: verificationId, activated: false})
                            .then(async validationdata => {
                                const valiedationemail = nodemailer.createTransport(smtpTransport({
                                    service: "Gmail",
                                    auth: {
                                        user: process.env.MAIL_EMAIL,
                                        pass: process.env.MAIL_APPPASSWORD
                                    }
                                }))
                                
                                const mailOptions = {
                                    from: `"Furmatematcher Services`,
                                    to: email,
                                    subject: "Furmatematcher Email Validation",
                                    html: `Dear ${firstname}, <br/><br/><br/>
                                    Thank you for registering with Furmatematcher! To complete the registration process and validate your account, please follow the steps below: <br/><br/><br/>
                                    1.) <b>Click on the Validation Link:</b><br/>
                                    ${process.env.WEB_URL}validation?value=${verificationId}<br/><br/><br/>
                                    2.)<b>Important Notes:</b><br/>
                                    * This validation link will expire in 24 hours.<br/>
                                    * Please ensure that you are using the latest version of your web browser.<br/>
                                    * If you did not sign up for Furmatematcher, please ignore this email.<br/><br/><br/>
                                    Thank you for choosing Furmatematcher. If you encounter any issues or have questions, feel free to contact our support team at ${process.env.MAIL_EMAIL}.<br/><br/><br/><br/>
                                    Best regards,<br/>
                                    The Furmatematcher Team`
                                }
                                
                                await valiedationemail.sendMail(mailOptions)
                                .then(() => {
                                    res.json({message: "success"})
                                })
                                .catch(async error => {

                                    await Users.findByIdAndDelete(user._id)
                                    await UserDetails.findByIdAndDelete(userdetails._id)
                                    await EmailValidation.findByIdAndDelete(validationdata)

                                    return res.status(400).json({ message: "bad-request", data: error.message })
                                })
                            })
                            .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
                            
                            })
                        .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
                    })
                    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
                }
                else{
                    return res.json({ message: "failed", data: "User already exist"})
                }
            })
        }
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
    
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}

exports.createrescuer = (req, res) => {
    const { username, password, email, street, municipality, province, country, zipcode, vision, mission, roleId } = req.body

    RescuerDetails.findOne({ $or: [{username: username}, {email: email}] })
    .then(data => {
        if (!data){
            Users.create({ roleId: roleId, username: username, password: password})
            .then(user => {
                RescuerDetails.create(req.body)
                .then(() => res.json({ message: "success" }))
            })
            .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
        }
        else{
            return res.json({ message: "failed", data: "User already exist"}) 
        }
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}