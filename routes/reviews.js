const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync.js')
const Review = require('../models/review.js')
const Campground = require('../models/campground.js')
const reviews = require('../controllers/reviews.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')
const ExpressError = require('../utils/ExpressError.js')

router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router