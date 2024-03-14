const cityData = require('./cities.js')
const {places, descriptors} = require('./seedHelpers.js')
const mongoose = require('mongoose')
const ClubReview = require('../models/clubreview.js')
mongoose.connect('mongodb://127.0.0.1:27017/clubreviews', {})
const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
    console.log("Database connected")
})

const seedDB = async() => {
    await ClubReview.deleteMany({})
    for(let i = 0; i < 50; i++){
        const rand1000 = Math.floor(Math.random()*(cityData.length-1))
        const place = new ClubReview({location: `${cityData[rand1000].city}, ${cityData[rand1000].admin_name}`, title: `${sample(descriptors)} ${sample(places)}`})
        await place.save()
    }
}

const sample = (arr) => {
    return arr[Math.floor(Math.random()*(arr.length-1))]
}

seedDB() //.then(() => {mongoose.connection.close()})
