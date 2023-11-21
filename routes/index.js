const routes = app => {
    console.log ("Routes are all available")

    app.use("/auth", require('./auth'))
    app.use("/user", require('./user'))
    app.use("/migrate", require('./migrate'))
    app.use("/emailverification", require("./emailvalidation"))
    app.use("/uploads", require('./picture'))
    app.use("/pets", require('./pets'))
}

module.exports = routes