if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

//express is a fuynction thats why needs to be called while path is an onject
//path is a js module
const express = require('express') 
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError.js')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const userRoutes = require('./routes/users.js')
const campgroundsRoutes = require('./routes/campgrounds.js')
const reviewsRoutes = require('./routes/reviews.js')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("db connected");
})

const app = express()

app.engine('ejs', ejsMate)
//sets view let express know when using res.render replac eit with .ejs
app.set('view engine', 'ejs')

//find views folder in the directory because it has the ejs file
app.set('views',path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret : 'thisisasecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

//storing and unstoring the user into the session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get('/', (req,res) => {
    res.render('home')
})

app.all('/{*path}', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message =  "Something went wrong"
    res.status(statusCode).render('error', { err })
})

app.listen(4000, ()=>{
    console.log('serving on port 4000')
})