const router = require("express").Router(),
    { migrate } = require("../controllers/Migrate")

router
    .post("/seed", migrate)

module.exports = router