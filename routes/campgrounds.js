const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync.js")
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js')
const ExpressError = require('../utils/ExpressError.js')
const Campground = require("../models/campground.js")
const campgrounds = require('../controllers/campgrounds.js')
const campground = require('../models/campground.js')

const { storage } = require('../cloudinary/index.js')
const multer = require('multer')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    .post(upload.array('image'), (req, res)=>{
        console.log(req.body, req.files)
        res.send("working")
    })

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router