const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConcertSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
})

module.exports = mongoose.model('ConcertReview', ConcertSchema);
