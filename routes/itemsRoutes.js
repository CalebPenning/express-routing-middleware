const express = require('express')
const router = new express.Router()
const ExpressError = require('../expressError')
const items = require('../fakeDb')

router.get('/', (req, res) => {
    return res.json({ items })
})

router.post('/', (req, res, next) => {
    try {
        if (!req.body.name || !req.body.price) throw new ExpressError("Name and price are both required.")
        const newItem = { name: req.body.name, price: req.body.price }
        return res.status(201).json({ added: newItem })
    } catch(e) {
        next(e)
    }
})

