const { default: mongoose } = require("mongoose")
const Roomchat = require("../models/Roomchat")

exports.createroom = (req, res) => {
    const { rescuerid, adopterid, roomname } = req.body

    const users = [new mongoose.Types.ObjectId(rescuerid), new mongoose.Types.ObjectId(adopterid)]
    Roomchat.findOne({participants: users, roomname: roomname})
    .then(room => {
        if (room){
            return res.json({message: "success", data: room})
        }
        Roomchat.create({ participants: users, roomname: roomname})
        .then(data => {
            return res.json({message: "success", data: data})
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}

exports.listroomchats = (req, res) => {
    const { adopterid } = req.query
    console.log(adopterid)
    Roomchat.find({participants: { $in: [adopterid]}})
    .then(data => {
        return res.json({message: "success", data: data})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}