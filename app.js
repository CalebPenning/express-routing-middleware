const express = require('express')
const app = express()
const itemsRoutes = require('./routes/itemsRoutes')
const ExpressError = require('./expressError')

app.use(express.json())
app.use("/items", itemsRoutes)

/* 404 Handler */

app.use(function(req, res, next) {
    return new ExpressError("Not Found", 404)
})

/* General error handler */

app.use(function(err, req, res, next) {
    res.status(err.status || 500)

    return res.json({
        error: err.message,
    })
})

module.exports = app