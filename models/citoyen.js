const mongoose = require('mongoose')




const citoyenSchema = mongoose.Schema({
    name: String,
    id: String,
    avatar: String,
    warn: Array,
    // A voir ci dessous:
    cv: {type: mongoose.Schema.Types.ObjectId, ref: 'citoyen', default: null }

})

module.exports = mongoose.model('citoyen', citoyenSchema)
