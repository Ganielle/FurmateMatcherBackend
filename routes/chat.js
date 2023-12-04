const router = require("express").Router(),
    { createroom, listroomchats, roomchathistory, sendchat } = require("../controllers/roomchat")
    

router
    .post("/createroom", createroom)
    .get("/listroomchats", listroomchats)
    .get("/roomchathistory", roomchathistory)
    .post("/sendchat", sendchat)

module.exports = router