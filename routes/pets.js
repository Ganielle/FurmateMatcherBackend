const router = require("express").Router()
const { createpets, petlistrescuer, listpetsadopter, listpetadoptercustomfilter, listpethomepage,likepet, likepetlist, petdetails, requestadoptpet } = require("../controllers/pets")
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
    .post("/listpetadoptercustomfilter", listpetadoptercustomfilter)
    .get("/listpethomepage", listpethomepage)
    .get("/likepet", likepet)
    .get("/likepetlist", likepetlist)
    .get("/petdetails", petdetails)
    .post("/requestadoptpet", requestadoptpet)

module.exports = router