require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5005 // server listen & PORT
 

// conectarnos a la db
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/artists-db')
  .then(() => {
    console.log('Connected to the database')
  })
  .catch((err) => {
    console.log('Error connecting to the database', err)
  })


// all middlewares & configurations here
app.use(logger("dev"));
app.use(express.static("public"));


// to allow CORS access from anywhere
app.use(cors({
  origin: '*'
}));


// below two configurations will help express routes at correctly receiving data. 
app.use(express.json()); // recognize an incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: false })); // recognize an incoming Request Object as a string or array
const Artist = require('./models/artist.model.js')


// all routes here...
app.get("/", (req, res, next) => {
  res.json({ message: "all good here!" })
})

app.get('/test/:bookId', (req, res) => {

  // acceder del servidor al valor del ID
  res.json({ message: "test route" })
})

app.get('/artist', (req, res) => {

  Artist.find( {isTouring: true} )
  .then((r) => {
    res.json(r)
  })
  .catch((e) => {
    console.log(e)
  })
})

app.post('/artist', (req, res) => {
  
  Artist.create({
    name: req.body.name,
    awardsWon: req.body.awardsWon,
    isTouring: req.body.isTouring,
    genre: req.body.genre
  })
  .then(() => {
    res.json('Artist created')
  })
  .catch((err) => {
    res.json('Error creating artist')
  })
  console.log(req.body)
  
})

app.get('/artist/search', (req, res) => {

  console.log(req.query)
  Artist.find( req.query ).select({name: 1, awardsWon: 1})
  .then((r) => {
    res.json(r)
  })
  .catch((e) => {
    console.log(e)
  })
})  

app.get('/artist/:artistId', (req, res) => {
  Artist.findById(req.params.artistId)
  .then((r) => {
    res.json(r)
  })
  .catch((e) => {
    console.log(e)
  })
})

app.delete('/artist/:artistId', async (req, res) => {
  try {
    console.log('eliminando...')
    await Artist.findByIdAndDelete(req.params.artistId)
    res.json('Artist deleted')
  } catch(e) {
    console.log(e)
  }

})

app.put('/artist/:artistId', async (req, res) => {
  console.log(req.params)
  console.log(req.body)
  try {
    await Artist.findByIdAndUpdate(req.params.artistId, {
      name: req.body.name,
      awardsWon: req.body.awardsWon,
      isTouring: req.body.isTouring,
      genre: req.body.genre
    })
    res.json('Artist updated')
  } catch(e) {
    console.log(e)
  }
})

app.patch('/artist/:artistId/increment-award', async (req, res) => {
  console.log(req.params)
  console.log(req.body)
    try {
      await Artist.findByIdAndUpdate(req.params.artistId, {
        $inc: {awardsWon: 1}
      })
      res.json('Award incremented')
    }catch(e) {
      console.log(e)
    }
})




app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
