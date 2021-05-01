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
    
    if (req.body.name && req.body.price) {
        foundItem.name = req.body.name
        foundItem.price = req.body.price
        return res.json({ updated: { foundItem }})
    }
    else if (!req.body.name && req.body.price) {
        foundItem.price = req.body.price
        return res.json({ updated: { foundItem } })
    }
    else if (req.body.name && !req.body.price) {
        foundItem.name = req.body.name
        return res.json({ updated: { foundItem } })
    }
    else {
        throw new ExpressError("Bad request. Make sure to have either a 'name' or 'price' parameter in the request body", 400)
    }
})

router.delete('/:name', (req, res) => {
    const foundItem = items.findIndex(item => item.name === req.params.name) 

    if (foundItem === -1) {
        throw new ExpressError("Item not found.", 404)
    }
    items.splice(foundItem, 1)
    res.json({ message: "Deleted" })
})

module.exports = router