const mongoose = require('mongoose')


const cvSchema = mongoose.Schema({

    citoyen: {type: mongoose.Schema.Types.ObjectId, ref: 'citoyen'},
    id: String,
    nom: {type: String, required: true},
    prenom: {type: String, required: true},
    age: {type: Array, required: true},
    disponnibilite: {type: String, required: true},
    qualiteDefault: {type: Array, required: true},
    experience: {type: String, required: true},
    motivation: {type: String, required: true},
    casier: {type: Array, required: true},
    skill: {type: String, required: true},
    whyYou: {type: String, required: true},
    annexe: {type: Array},
    avatar: String,


})

module.exports = mongoose.model('cv', cvSchema)
