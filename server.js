if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { 
useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

const express = require('express')
const ShortUrl = require('./models/shortUrl')
const app = express()


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  //const shortUrls = await ShortUrl.find()
  var passedVariable = req.query.valid
  if (passedVariable == null) {
    res.render('index', { shortUrls:  null})
  }
  else{
    const shortUrls = await ShortUrl.find().sort({ _id: -1 }).limit(1)
    res.render('index', { shortUrls: shortUrls })

  }
//   const shortUrls = await ShortUrl.find().sort({ _id: -1 }).limit(1)
//   res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/?valid=T')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5050);
