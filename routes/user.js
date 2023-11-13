const router = require("express").Router(),
    { createuser } = require("../controllers/users")

router
    .post("/createuser", createuser)

module.exports = router