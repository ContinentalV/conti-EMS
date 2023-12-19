const mongoose = require('mongoose')


const employeSchema = mongoose.Schema({
    id: {type: String, required: true},
    agent: {type: String, required: true},
    typeNotation: {type: String, eval: ['Formations', 'Evaluations'], required:true},
    average:{type:Number, default: null},
    notation:{ comportement: {type: Number, required:true}, quality: {type:Number, required:true}, implication: {type: Number, required:true}, connaissance: {type: Number, required:true} }

})











module.exports = mongoose.model('employe',employeSchema)
