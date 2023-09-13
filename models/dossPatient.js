const mongoose = require('mongoose')
const dayjs  =  require('dayjs')


const dossierPatientSchema = mongoose.Schema({

    nom: {type: String, required: true},
    prenom: {type: String, required: true},
    identity: {type: String, required: true},
    cause: {type:String, require: true},
    agent: {type: String, required: true},
    partner: {type: String , default: null},
    montant: {type: Number, required: true},
    facturePaid: {type: Boolean, required: true},
    intervenant: {type: Array, required: true },
    metier: {type: Array, required:true },
    symptome: {type: String,  required:true },
    postTraitement : {type: String,  required:true },
    noteCplmt: {type: String },



})

dossierPatientSchema.methods.extractDataFromDocument = function() {

    // EXTRACT DATE
    const objDate = this._id
    const ts = objDate.getTimestamp()
    const formatage = dayjs(ts).format('DD/MM/YYYY HH:mm:ss')

    // EXTRACT SUIVI
    let cause, symptome, postTraitement, noteCplmt, date, intervenant;

    cause = this.cause;
    symptome = this.symptome;
    postTraitement = this.postTraitement;
    noteCplmt = this.noteCplmt;
    date = formatage
    intervenant = this.intervenant;

    return  { cause, symptome, postTraitement, noteCplmt, date, intervenant}



}


module.exports = mongoose.model('dossierPatient',dossierPatientSchema)