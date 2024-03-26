const express = require('express')
const router = express.Router()
const { clubSchema } = require('../schemas.js')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/AppError')
const Club = require('../models/club.js')

const validateClub = (req, res, next) => {
    const { error } = clubSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new AppError(msg, 400)
    } else {
        next()
    }
}

router.get('/new', (req, res) => {
    res.render('clubs/new')
})

router.get('/', catchAsync(async (req, res) => {
    const clubs = await Club.find()
    res.render('./clubs/index', { clubs })
}))

router.get('/:id', catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id).populate('reviews')
    if(!club){
        req.flash('error', 'Club does not exist!')
        return res.redirect('/clubs')
    }
    res.render('clubs/show', { club })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const club = await Club.findById(req.params.id)
    if(!club){
        req.flash('error', 'Club does not exist!')
        return res.redirect('/clubs')
    }
    res.render('clubs/edit', { club })
}))

router.post('/', validateClub, catchAsync(async (req, res, next) => {

    const club = new Club(req.body.club)
    await club.save()
    req.flash('success', 'New club created!')
    res.redirect(`/clubs/${club._id}`)
}))

router.put('/:id', validateClub, catchAsync(async (req, res) => {
    const { id } = req.params
    const club = await Club.findByIdAndUpdate(id, { ...req.body.club })
    req.flash('success', 'Club updated successfully!')
    res.redirect(`/clubs/${club._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const club = await Club.findByIdAndDelete(req.params.id)
    /* const clubs = await Club.find({})
    res.render('./clubs/index', { clubs }) */
    req.flash('success', 'Club deleted successfully!')
    res.redirect('/clubs')
}))

module.exports = router;