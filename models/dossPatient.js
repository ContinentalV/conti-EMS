const mongoose = require('mongoose')


const dossierPatientSchema = mongoose.Schema({

    nom: {type: String, required: true},
    prenom: {type: String, required: true},
    identity: {type: String, required: true},
    cause: {type:String, require: true},
    agent: {type: String, required: true},
    partner: {type: String , default: null},
    montant: {type: Number, required: true},
    facturePaid: {type: Boolean, required: true}

})

module.exports = mongoose.model('dossierPatient',dossierPatientSchema)