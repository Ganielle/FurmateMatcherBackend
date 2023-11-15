const router = require("express").Router(),
    { createuser, createrescuer } = require("../controllers/Users"),
    { emailvalidate } = require("../controllers/emailvalidation")

router
    .post("/createuser", createuser)
    .post("/createrescuer", createrescuer)
    .post("/validation", emailvalidate)

module.exports = router