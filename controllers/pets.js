const Pets = require("../models/Pets")
const PetPreference = require("../models/Petpreference")
const LikePets = require("../models/Likepets")
const RescuerDetails = require("../models/Rescuerdetails")
const UserDetails = require("../models/Userdetails")
const PetAdoptionRequest = require("../models/Petadoptionrequest")
const PetViewHistory = require("../models/Petviewhistory")
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
        if (filter[key] !== '' && filter[key] != 'any'){
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
    const { petid, userid } = req.query

    Pets.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(petid)
            }
        },
        {
            $lookup: {
                from: "petadoptionrequests",
                localField: "_id",
                foreignField: "pet",
                as: "requestadopt"
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
                from: "userdetails",
                localField: "adoptedby",
                foreignField: 'user',
                as: 'adopterDetails'
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "ownerDetails.owner",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $group: {
              _id: '$_id',
              pendingCount: {
                $sum: {
                  $size: {
                    $filter: {
                      input: '$requestadopt',
                      as: 'request',
                      cond: {
                        $and: [
                          { $eq: ['$$request.status', 'pending'] },
                          { $eq: ['$$request.requester', new mongoose.Types.ObjectId(userid)] }
                        ]
                      }
                    }
                  }
                }
              },
              successCount: {
                $sum: {
                  $size: {
                    $filter: {
                      input: '$requestadopt',
                      as: 'request',
                      cond: {
                        $and: [
                          { $eq: ['$$request.status', 'success'] },
                          { $eq: ['$$request.requester', new mongoose.Types.ObjectId(userid)] }
                        ]
                      }
                    }
                  }
                }
              },
              
              data: { $first: '$$ROOT' }
            }
          },
          {
            $project: {
                _id: '$data._id',
                owner: '$data.owner',
                breed: '$data.breed',
                createdAt: '$data.createdAt',
                description: '$data.description',
                gender: '$data.gender',
                located: '$data.located',
                maintenance: '$data.maintenance',
                name: '$data.name',
                ownerDetails: '$data.ownerDetails',
                personalitytraits: '$data.personalitytraits',
                picture: '$data.picture',
                special: '$data.special',
                type: '$data.type',
                userDetails: '$data.userDetails',
                adopterDetails: '$data.adopterDetails',
                // Add other fields as needed
                hasPendingRequests: { $gt: ['$pendingCount', 0] },
                hasSuccessRequests: { $gt: ['$successCount', 0] }
                // Add other fields as needed
            }
          }
    ])
    .then(data => {
        return res.json({message: "success", data: data})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}

exports.requestadoptpet = (req, res) => {
    const { userid, petid } = req.body

    PetAdoptionRequest.create({requester: userid, pet: petid, status: "pending"})
    .then(data => {
        return res.json({message: "success"})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}

exports.adoptpetlist = (req, res) => {
    const { userid } = req.query
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    }

    PetAdoptionRequest.aggregate([
        {
            $lookup: {
                from: "pets",
                localField: "pet",
                foreignField: "_id",
                as: "petdata"
            }
        },
        {
            $lookup: {
                from: "userdetails",
                localField: "requester",
                foreignField: "user",
                as: "adopterdetails"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "requester",
                foreignField: "_id",
                as: "adopteruserdetails"
            }
        },
        {
            $unwind: "$adopterdetails"
        },
        {
            $unwind: "$petdata"
        },
        {
            $unwind: "$adopteruserdetails"
        },
        {
            $match: {
                "petdata.owner": new mongoose.Types.ObjectId(userid),
                "status": "pending"
            }
        },
        {
            $facet: {
                data: [
                    { $skip: pageOptions.page * pageOptions.limit },
                    { $limit: pageOptions.limit }
                ],
                metadata: [
                    { $count: "totalDocuments" }
                ]
            }
        }
    ])
    .then(result => {
        const totalDocuments = result[0].metadata[0] ? result[0].metadata[0].totalDocuments : 0;
        const totalPages = Math.ceil(totalDocuments / pageOptions.limit);
        return res.json({message: "success", data: result, pages: totalPages})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}

exports.approverejectadopter = (req, res) => {
    const { userid, status, petid } = req.body
    console.log(userid)
    PetAdoptionRequest.findOneAndUpdate({requester: new mongoose.Types.ObjectId(userid), pet: new mongoose.Types.ObjectId(petid)}, {status: status})
    .then(data => {
        Pets.findOneAndUpdate({_id: new mongoose.Types.ObjectId(petid)}, {adoptedby: new mongoose.Types.ObjectId(userid)})
        .then(() => {
            return res.json({message: "success"})
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}

exports.deletepet = async (req, res) => {
    const { petid } = req.body

    await Pets.findOneAndDelete({_id: petid})
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))

    await LikePets.deleteMany({pet: petid})
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))

    await PetAdoptionRequest.deleteMany({pet: petid})
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))

    return res.json({message: "success"})
}

exports.updatepet = async(req, res) => {
    const { petid ,userid, petname, type, gender, breed, age, personality, special, maintenance, located, description } = req.body

    let picture = ""
    const personalitydata = JSON.parse(personality)
    const dataupdate = {
        "name": petname,
        "type": type,
        "gender": gender,
        "breed": breed,
        "age": age,
        "personalitytraits": personalitydata,
        "special": special,
        "maintenance": maintenance,
        "located": located,
        "description": description
    }

    if (req.file){
        picture = req.file.path
        dataupdate["picture"] = picture
    }

    Pets.findOneAndUpdate({_id: petid, owner: userid}, dataupdate)
    .then(data => {
        return res.json({message: "success"})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}

exports.addhistoryviewpet = async(req, res) => {
    const { userid, petid } = req.body

    PetViewHistory.create({owner: new mongoose.Types.ObjectId(userid), pet: new mongoose.Types.ObjectId(petid)})
    .then(data => {
        return res.json({message: "success"})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}

exports.viewhistorypet = async(req, res) => {
    const { userid } = req.query;
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    }

    PetViewHistory.find({owner: new mongoose.Types.ObjectId(userid)})
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({'createdAt': -1})
    .populate({
        path: "pet"
    })
    .then(data => {
        PetViewHistory.countDocuments({owner: new mongoose.Types.ObjectId(userid)})
        .then( count => {
            const totalPages = Math.ceil(count / 10)
            res.json({ message: "success", data: data, pages: totalPages })
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message }))
}