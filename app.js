const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/clubreviews', {})
const db = mongoose.connection
const ClubReview = require('./models/clubreview')
const clubreview = require('./models/clubreview')

db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
    console.log("Database connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

app.get('/', (req,res) => {
    console.log("index seite erreicht")
    res.render('home')
})

app.get('/clubs/new', (req,res) => {
    res.render('clubs/new')
})

app.post('/clubs', async (req,res) => {
    const club = new ClubReview(req.body.club)
    await club.save()
    res.redirect(`/clubs/${club._id}`)
})

app.get('/clubs', async (req,res) => {
    const clubs = await ClubReview.find()
    res.render('./clubs/index', {clubs})
})

app.get('/clubs/:id', async (req,res) => {
    const club = await ClubReview.findById(req.params.id)
    res.render('clubs/show', {club})
})

app.get('/clubs/:id/edit', async (req,res) => {
    const club = await ClubReview.findById(req.params.id)
    res.render('clubs/edit', {club})
})

app.put('/clubs/:id', async (req,res) => {
    const {id} = req.params
    const club = await ClubReview.findByIdAndUpdate(id, {...req.body.club})
    res.redirect(`/clubs/${club._id}`)
})

app.delete('/clubs/:id', async (req,res) => {
    const club = await ClubReview.findByIdAndDelete(req.params.id)
    const clubs = await clubreview.find({})
    res.render('./clubs/index', {clubs})
})


