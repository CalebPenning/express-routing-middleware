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
        items.push(newItem)
        return res.status(201).json({ added: newItem })
    } catch(e) {
        next(e)
    }
})

router.get('/:name', (req, res) => {
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
        throw new ExpressError("Item not found.", 404)
    }
    res.json({ item: foundItem })
})

router.patch('/:name', (req, res) => {
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
        throw new ExpressError("Item not found.", 404)
    }
    if (req.params.name !== foundItem.name && req.params.price !== foundItem.price) {
        foundItem.name = req.params.name
        foundItem.price = req.params.price
        return res.json({ item: foundItem })
    }
    else if (req.params.name !== foundItem.name && !req.params.price) {
        foundItem.name = req.params.name
        return res.json({ item: foundItem })
    }
    else if (req.params.price !== foundItem.price && !req.params.name) {
        foundItem.price = req.params.price
        return res.json({ item: foundItem })
    }
    else {
        throw new ExpressError("Bad request", 400)
    }
})

module.exports = router