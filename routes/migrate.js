const router = require("express").Router(),
    { migrate } = require("../controllers/migrate")

router
    .post("/seed", migrate)

module.exports = router