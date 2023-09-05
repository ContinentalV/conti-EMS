const mongoose = require('mongoose')




const gradesSchema = mongoose.Schema({

    gradeId: {type: String, required: true},
    gradeName: {type:String, required:true},
    gradeRatio: {type: Number, required: true},
    prime: {type: Boolean, required: true},
    position: {type: Number}

})

module.exports = mongoose.model('grades', gradesSchema)
