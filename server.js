//Code for Application - Basic Server 
const express = require("express")
//set up our entire application
const app = express()
app.use(express.urlencoded({extended:false}))
//shortUrls
const shortUrl = require('./models/shortUrl')
//Saving our new short urls in our database 
const mongoose = require("mongoose")
//here we need to connect to our database 
mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser :true, useUnifiedTopology:true
})
//we need to set up our view ejs engine
app.set('view engine','ejs')
//to find simple route we write app.get
app.get("/", async (req,res) => {
    const shortUrls = await shortUrl.find()
    res.render('index',{shortUrls: shortUrls})
    //so we are rendering everything that is in our index.ejs
})
//POST 
app.post("/shortUrls",async (req,res) => {
    await shortUrl.create({full :req.body.fullUrl})
    res.redirect('/')
})
//another route
app.get('/:shortUrl',async (req,res) =>{
    const ShortUrl = await shortUrl.findOne({short: req.params.shortUrl})
    if(ShortUrl == null) return res.sendStatus(404)
    ShortUrl.clicks++
    ShortUrl.save()
    res.redirect(ShortUrl.full)
})
app.listen(process.env.PORT || 8080);