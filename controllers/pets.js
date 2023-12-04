const Pets = require("../models/Pets")
const PetPreference = require("../models/Petpreference")
const LikePets = require("../models/Likepets")
const RescuerDetails = require("../models/Rescuerdetails")
const UserDetails = require("../models/Userdetails")
const { default: mongoose } = require("mongoose")

exports.createpets = (req, res) => {
    const { id, petname, type, gender, breed, age, personality, special, maintenance, located, description } = req.body

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
        gender: gender, breed: breed, age: age, personalitytraits: personalitydata, special: special, maintenance: maintenance, located: located, picture: picture, description: description
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
            personalitytraits: { $in: preference.personalitytraits },
            special: preference.specialdogs,
            maintenance: preference.petmaintenance,
            located: preference.located
        }

        Pets.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: 'likepets', // Adjust the collection name as needed
                    localField: '_id',
                    foreignField: 'pet',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    isLiked: {
                        $cond: {
                            if: {
                                $in: [new mongoose.Types.ObjectId(id) ,'$likes.owner']
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            }
        ])
        .then(data => res.json({ message: "success", data: data}))
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}

exports.listpetadoptercustomfilter = (req, res) => {
    const { located, type, breed, age, gender, personality, id } = req.body

    const filter = {
        located: located,
        type: type,
        breed: breed,
        age: age,
        gender: gender,
        personalitytraits: personality
    }

    const filtercriteria = {}

    Object.keys(filter).forEach(key => {
        if (filter[key] !== ''){
            filtercriteria[key] = filter[key]
        }
    })

    Pets.aggregate([
        { $match: filtercriteria },
        {
            $lookup: {
                from: 'likepets', // Adjust the collection name as needed
                localField: '_id',
                foreignField: 'pet',
                as: 'likes'
            }
        },
        {
            $addFields: {
                isLiked: {
                    $cond: {
                        if: {
                            $in: [new mongoose.Types.ObjectId(id) ,'$likes.owner']
                        },
                        then: true,
                        else: false
                    }
                }
            }
        }
    ])
    .then(data => res.json({ message: "success", data: data }))
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}

exports.listpethomepage = async (req, res) => {
    const totalCount = await Pets.count().then(data => data);
    const randomSkip = Math.floor(Math.random() * totalCount)

    Pets.aggregate([
        {
            $skip: randomSkip
        },
        {
            $limit: 6
        }
    ])
    .then(data => res.json({ message: "success", data: data}))
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}

exports.likepet = async(req, res) => {
    const { petid, userid } = req.query

    LikePets.findOne({pet: petid, owner: userid})
    .then(data => {
        if (data){
            LikePets.findOneAndDelete({pet: petid, owner: userid})
            .then(() => res.json({ message: "success" }))
            .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
        }
        else{
            LikePets.create({pet: petid, owner: userid})
            .then(() => res.json({ message: "success"}))
            .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
        }
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}

exports.likepetlist = async(req, res) => {
    const { userid } = req.query

    LikePets.find({owner: userid})
    .populate({
        path: "pet"
    })
    .then(data => res.json({message: "success", data: data}))
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}

exports.petdetails = async (req,res) => {
    const { petid } = req.query

    Pets.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(petid)
            }
        },
        {
            $lookup: {
                from: "rescuerdetails",
                localField: "owner",
                foreignField: 'owner',
                as: 'ownerDetails'
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "ownerDetails.owner",
                foreignField: "_id",
                as: "userDetails"
            }
        }
    ])
    .then(data => {
        return res.json({message: "success", data: data})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}