const router = require("express").Router(),
    { createuser, createrescuer } = require("../controllers/Users")

router
    .post("/createuser", createuser)
    .post("/createrescuer", createrescuer)

module.exports = router