const router = require("express").Router()
const { createpets, petlistrescuer, listpetsadopter } = require("../controllers/pets")
const upload = require("../middleware/uploadspic")

const uploadimg = upload.single("file")

router
    .post("/addpet", function (req, res, next){
        uploadimg(req, res, function(err) {
            if (err){
                return res.status(400).send({ message: "failed", data: err.message })
            }

            next()
        })
    }, createpets)
    .get("/listpets", petlistrescuer)
    .get("/listpetsfilter", listpetsadopter)

module.exports = router