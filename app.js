const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const cityData = require('./Seeds/cities.js')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/concertreviews', {})
const db = mongoose.connection
const ConcertReview = require('./models/concertreview')

db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
    console.log("Database connected")
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

app.get('/', (req,res) => {
    console.log("index seite erreicht")
    res.render('home')
})

app.get('/makereview', async (req,res) => {
    const review = new ConcertReview({title: "First Concert", description: "drecks konzert"})
    await review.save()
    res.send(review)
})