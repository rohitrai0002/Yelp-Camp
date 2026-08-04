//express is a fuynction thats why needs to be called while path is an onject
//path is a js module
const express = require('express') 
const path = require('path')
const mongoose = require('mongoose')
const Campground = require("./models/campground.js")
const methodOverrirde = require('method-override')
const ejsMate = require('ejs-mate')


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
app.use(methodOverrirde('_method'))

app.get('/', (req,res) => {
    res.render('home')
})

// app.get('/campgrounds', async (req,res) => {
//     const camp = new Campground({title : "My Backyard", description : "cheap camping!"})
//     await camp.save()
//     res.send(camp)
// })

app.get('/campgrounds', async(req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async(req,res)=> {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async(req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground })
})

app.get('/campgrounds/:id/edit', async(req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground }) 
})

app.put('/campgrounds/:id', async(req,res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.listen(4000, ()=>{
    console.log('serving on port 4000')
})