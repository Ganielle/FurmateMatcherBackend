const Pets = require("../models/Pets")
const PetPreference = require("../models/Petpreference")
const { default: mongoose } = require("mongoose")

exports.createpets = (req, res) => {
    const { id, petname, type, gender, breed, age, personality, special, maintenance, located } = req.body

    let picture = ""

    if (req.file){
        picture = req.file.path
    }
    else{
        return res.json({message: "failed", data: "Please select an image first!"})
    }

    const personalitydata = JSON.parse(personality)

    Pets.create({
        owner: id, name: petname, type: type,
        gender: gender, breed: breed, age: age, personalitytraits: personalitydata, special: special, maintenance: maintenance, located: located, picture: picture
    })
    .then(data => {
        return res.json({ message: "success" })
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}

exports.petlistrescuer = (req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    }

    const { id } = req.query

    Pets.find({owner: new mongoose.Types.ObjectId(id)})
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({'createdAt': -1})
    .then(data => {
        Pets.countDocuments({owner: new mongoose.Types.ObjectId(id)})
        .then(count => {
            const totalPages = Math.ceil(count / 10)
            res.json({ message: "success", data: data, pages: totalPages })
        })
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}

exports.listpetsadopter = (req, res) => {
    const { id } = req.query

    PetPreference.findOne({owner: new mongoose.Types.ObjectId(id)})
    .then(preference => {
        const filter = {
            type: preference.typepet,
            gender: preference.genderpet,
            breed: { $in: preference.breedpet },
            personalitytraits: { $in: preference.personalitytraits }
        }

        Pets.find(filter)
        .then(data => res.json({ message: "success", data: data}))
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}