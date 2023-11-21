const router = require("express").Router(),
    { createuser, createrescuer, uploadprofilepicture, userprofile } = require("../controllers/Users"),
    { emailvalidate } = require("../controllers/emailvalidation"),
    upload = require("../middleware/uploadspic")

const uploadimg = upload.single("file")

router
    .post("/createuser", createuser)
    .post("/createrescuer", createrescuer)
    .post("/validation", emailvalidate)
    .post("/uploadpic", function (req, res, next){
        uploadimg(req, res, function(err) {
            if (err){
                return res.status(400).send({ message: "failed", data: err.message })
            }

            next()
        })
    }, uploadprofilepicture)
    .get("/userprofile", userprofile)

module.exports = router