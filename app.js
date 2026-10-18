//express is a fuynction thats why needs to be called while path is an onject
//path is a js module
const express = require('express') 
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError.js')
const ejsMate = require('ejs-mate')



const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

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

const validateReview = (req,res,next) => {
    console.log("Request body:", req.body);
    const { error } = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next()
    }

}

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)
app.get('/', (req,res) => {
    res.render('home')
})

// app.get('/campgrounds', async (req,res) => {
//     const camp = new Campground({title : "My Backyard", description : "cheap camping!"})
//     await camp.save()
//     res.send(camp)
// })


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