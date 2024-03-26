const express = require('express')
const router = express.Router({ mergeParams: true})
const { reviewSchema } = require('../schemas.js')
const catchAsync = require('../utilities/catchAsync')
const AppError = require('../utilities/AppError')
const Review = require('../models/review.js')
const Club = require('../models/club.js')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new AppError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const id = req.params.id
    const club = await Club.findById(id)
    const review = new Review(req.body.review)
    club.reviews.push(review)
    await review.save()
    await club.save()
    req.flash('success', 'Review created!')
    res.redirect(`/clubs/${id}`)
}))

router.delete('/:reviewId', catchAsync(async(req,res) => {
    const {id, reviewId} = req.params
    const club = await Club.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    const review = await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review successfully deleted!')
    res.redirect(`/clubs/${club._id}`)
}))

module.exports = router;