const mongoose = require('mongoose')

const fruitSchema = new mongoose.Schema({
    name: { type: String, required: true},
    color: { type: String, required: true},
    isRipe: { type: Boolean, required: true}
})

const Fruit = mongoose.model('Fruit', fruitSchema)

module.exports = Fruit