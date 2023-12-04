const router = require("express").Router(),
    { createroom, listroomchats } = require("../controllers/roomchat")
    

router
    .post("/createroom", createroom)
    .get("/listroomchats", listroomchats)

module.exports = router