const { default: mongoose } = require("mongoose")
const Roomchat = require("../models/Roomchat")
const ChatHistory = require("../models/Chathistory")

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

    Roomchat.find({participants: { $in: [adopterid]}})
    .then(data => {
        return res.json({message: "success", data: data})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}

exports.roomchathistory = (req, res) => {
    const { roomid } = req.query

    ChatHistory.find({roomid: new mongoose.Types.ObjectId(roomid)})
    .populate({
        path: "sender roomid"
    })
    .then(data => {
        return res.json({message: "success", data: data})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}

exports.sendchat = (req, res) => {
    const { roomid, userid, content } = req.body

    ChatHistory.create({roomid: roomid, sender: userid, content: content})
    .then(data => {
        return res.json({message: "success"})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message })) 
}