const router = require("express").Router()
const {emailvalidate} = require("../controllers/emailvalidation")

router
    .post("/validate", emailvalidate)

module.exports = router