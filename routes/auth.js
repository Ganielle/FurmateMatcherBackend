const router = require("express").Router(),
    { login } = require("../controllers/auth")
    

router
    .post("/login", login)

module.exports = router