const routes = app => {
    console.log ("Routes are all available")

    app.use("/auth", require('./auth'))
    app.use("/user", require('./user'))
    app.use("/migrate", require('./migrate'))
}

module.exports = routes