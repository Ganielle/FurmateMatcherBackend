const Users = require("../models/User")
const UserDetails = require("../models/Userdetails")
const RescuerDetails = require("../models/Rescuerdetails")
const EmailValidation = require("../models/Emailvalidation")
const UserPreference = require("../models/Userpreference")
const PetPreference = require("../models/Petpreference")
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2');
const smtpTransport = require('nodemailer-smtp-transport');
const { default: mongoose } = require("mongoose")

exports.createuser = (req, res) => {
    const { username, password, email, contactnumber, firstname, middlename, lastname, gender, dob, street, municipality, province, country, zipcode, location, typeofhome, aloneothers, ownershipstatus, breedowned, petshave, located, typepet, genderpet, agepet, specialdogs, breedpet, personalitytraits, petmaintenance } = req.body

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
                        UserDetails.create({user: user._id, firstname: firstname, lastname: lastname, gender: gender, dob: dob, street: street, municipality: municipality, province: province, country: country, zipcode: zipcode, email: email, contactnumber: contactnumber})
                        .then(async userdetails => {

                            await UserPreference.create({
                                owner: new mongoose.Types.ObjectId(user._id),
                                userdetails: new mongoose.Types.ObjectId(userdetails._id),
                                location: location,
                                typeofhome: typeofhome,
                                aloneothers: aloneothers,
                                ownershipstatus: ownershipstatus,
                                breedowned: breedowned,
                                petshave: petshave,
                            })
                            .catch(async error => { 
                                await Users.findByIdAndDelete(user._id)
                                await UserDetails.findByIdAndDelete(userdetails._id)
                                res.status(400).json({ message: "bad-request", data: error.message }) 
                            })

                            await PetPreference.create({
                                owner: new mongoose.Types.ObjectId(user._id),
                                located: located,
                                typepet: typepet,
                                genderpet: genderpet,
                                agepet: agepet,
                                specialdogs: specialdogs,
                                breedpet: breedpet,
                                personalitytraits: personalitytraits,
                                petmaintenance: petmaintenance
                            })
                            .catch(async error => { 
                                await UserPreference.findOneAndDelete({owner: user._id})
                                await Users.findByIdAndDelete(user._id)
                                await UserDetails.findByIdAndDelete(userdetails._id)
                                res.status(400).json({ message: "bad-request", data: error.message }) 
                            })

                            const verificationId = nanoid(10)

                            await EmailValidation.create({owner: user._id, token: verificationId, activated: false})
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
                                    await EmailValidation.findByIdAndDelete(validationdata._id)

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

    RescuerDetails.findOne({ $or: [{email: email}] })
    .then(data => {
        if (!data){
            Users.create({ roleId: roleId, username: username, password: password})
            .then(async user => {
                await RescuerDetails.create({ owner: new mongoose.Types.ObjectId(user._id), email: email, street: street, municipality: municipality, province: province, country: country, zipcode: zipcode, vision: vision, mission: mission})

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
                        html: `Dear ${username}, <br/><br/><br/>
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
                        console.log("Rescue: " + data._id)
                        console.log("Users: " + user._id)
                        console.log("email: " + validationdata._id)
                        await Users.findByIdAndDelete(user._id)
                        await RescuerDetails.findByIdAndDelete(data._id)
                        await EmailValidation.findByIdAndDelete(validationdata._id)

                        return res.status(400).json({ message: "bad-request", data: error.message })
                    })
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

exports.uploadprofilepicture = (req, res) => {
    const { id } = req.body

    let content = {
        profilepic: ""
    }

    if (req.file){
        content.profilepic = req.file.path
    }
    else{
        return res.json({message: "failed", data: "Please select an image first!"})
    }

    UserDetails.findOneAndUpdate({user: new mongoose.Types.ObjectId(id)}, content)
    .then(() => res.json({message: "success"}))
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}

exports.userprofile = (req, res) => {
    const { id } = req.query

    UserPreference.findOne({owner: new mongoose.Types.ObjectId(id)})
    .populate({
        path: "userdetails"
    })
    .then(data => {

        PetPreference.findOne({owner: new mongoose.Types.ObjectId(id)})
        .then(petdata => {
            let userprofiledata = {
                petdata: petdata,
                preference: data
            }
            res.json({message: "success", data: userprofiledata})
        })
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}