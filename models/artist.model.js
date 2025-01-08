const mongoose = require('mongoose')

// CREAR EL SCHEMA
  const artistSchema = new mongoose.Schema({
    name : {
     type : String,
     required : true,
     unique: true
    },
    awardsWon : {
     type : Number
    },
    isTouring : {    
     type : Boolean
    },
    genre : [String]
  })

// CREAR EL MODELO
  const Artist = mongoose.model('Artist', artistSchema)

// EXPORTAR EL MODELO
  module.exports = Artist