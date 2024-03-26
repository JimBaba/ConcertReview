const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const AppError = require('./utilities/AppError')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/clubreviews', {})
const db = mongoose.connection
// const Club = require('./models/club.js')
// const Review = require('./models/review.js')
// const { clubSchema, reviewSchema } = require('./schemas.js')
const clubs = require('./routes/clubs.js')
const reviews = require('./routes/reviews.js')
const sessionConfig = {
    secret: 'thisneedstobeabettersecret', 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 7,
        maxAge: 1000 * 60 * 60 * 7
    }
}

db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
    console.log("Database connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session(sessionConfig))
app.use(flash())

// APP MIDDLEWARE START

app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/clubs', clubs)
app.use('/clubs/:id/reviews', reviews)

// APP MIDDLEWARE END

// CLUB ROUTES START

app.get('/', (req, res) => {
    console.log("index seite erreicht")
    res.render('home')
})

// CLUB ROUTES END

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