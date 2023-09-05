const mongoose = require('mongoose')




const absenceSchema = mongoose.Schema({
    id: String,
    name: String,
    raison: String,
    start: Number,
    back: Number,
    active: Boolean,
    finished:Boolean,

    //cv: {type: mongoose.Schema.Types.ObjectId, ref: 'absence', default: null }



})

module.exports = mongoose.model('absence', absenceSchema)
