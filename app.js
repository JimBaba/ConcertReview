const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utilities/catchAsync')
const AppError = require('./utilities/AppError')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/clubreviews', {})
const db = mongoose.connection
const Club = require('./models/club.js')
const Review = require('./models/review.js')
const { clubSchema, reviewSchema } = require('./schemas.js')

db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
    console.log("Database connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// APP FUNCTIONS START

const validateClub = (req, res, next) => {
    const { error } = clubSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new AppError(msg, 400)
    } else {
        next()
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new AppError(msg, 400)
    } else {
        next()
    }
}

// APP FUNCTIONS END

// CLUB ROUTES START

app.get('/', (req, res) => {
    console.log("index seite erreicht")
    res.render('home')
})

app.get('/clubs/new', (req, res) => {
    res.render('clubs/new')
})

app.get('/clubs', catchAsync(async (req, res) => {
    const clubs = await Club.find()
    res.render('./clubs/index', { clubs })
}))

app.get('/clubs/:id', catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id).populate('reviews')
    res.render('clubs/show', { club })
}))

app.get('/clubs/:id/edit', catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id)
    res.render('clubs/edit', { club })
}))

app.post('/clubs', validateClub, catchAsync(async (req, res, next) => {

    const club = new Club(req.body.club)
    await club.save()
    res.redirect(`/clubs/${club._id}`)
}))

app.put('/clubs/:id', validateClub, catchAsync(async (req, res) => {
    const { id } = req.params
    const club = await Club.findByIdAndUpdate(id, { ...req.body.club })
    res.redirect(`/clubs/${club._id}`)
}))

app.delete('/clubs/:id', catchAsync(async (req, res) => {
    const club = await Club.findByIdAndDelete(req.params.id)
    /* const clubs = await Club.find({})
    res.render('./clubs/index', { clubs }) */
    res.redirect('/clubs')
}))

// CLUB ROUTES END

// REVIEW ROUTES START

app.post('/clubs/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const id = req.params.id
    const club = await Club.findById(id)
    const review = new Review(req.body.review)
    club.reviews.push(review)
    await review.save()
    await club.save()
    res.redirect(`/clubs/${id}`)
}))

app.delete('/clubs/:id/reviews/:reviewId', catchAsync(async(req,res) => {
    const {id, reviewId} = req.params
    const club = await Club.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    const review = await Review.findByIdAndDelete(reviewId)
    res.redirect(`/clubs/${club._id}`)
}))

// REVIEW ROUTES END

// ERROR HANDLING START

app.all('*', (req, res, next) => {
    next(new AppError("Page not found!", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.msg) err.msg = "Oh no, something went wrong!"
    res.status(statusCode).render('error', { err })
})

// ERROR HANDLING END

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})