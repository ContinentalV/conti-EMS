const mongoose = require('mongoose')


const employeSchema = mongoose.Schema({
    id: {type: String, required: true},
    citoyen: {type: mongoose.Schema.Types.ObjectId, ref: 'citoyen'},
    nom: {type: String, required: true},
    prenom: {type: String, required: true},
    avatar: String,
    grade: {type: String, required:true },
    matricule: {type: String, required:true},
    service: {pds: {type: Number, default: 0}, fds: {type:Number, default: 0}, workingTime: {type: Number, default:0}},
    isService: {type:Boolean, default: false},
    isCity: {type:Boolean, default: false},
    reanimation: {type: Number, default: 0},
    paye: {type: Number, default: 0},
    historique: Array,
    payeGlobal: {type: Number, default: 0},
    resetTime: Number,
    absence:Array,
    formation:Array ,
    metier: Array,
})









employeSchema.methods.updateWorkingTime = function() {
    if (this.service.pds === 0 || this.service.fds === 0) {
        throw new Error("La date de PDS ou de FDS n'est pas encore enregistrée");
    }
    const TimeStampToMinute = (millis) => {
        const minutes = Math.round(millis / 60000);
        return minutes

    }
    const pdsMinutes = TimeStampToMinute(this.service.pds)  ; // Conversion en minutes
    const fdsMinutes = TimeStampToMinute(this.service.fds) ; // Conversion en minutes
    const workingTime = fdsMinutes - pdsMinutes + this.service.workingTime;

    this.service.workingTime = workingTime;
     this.historique.push({pds: this.service.pds,   fds: this.service.fds, workingTime: fdsMinutes - pdsMinutes})
    this.service.pds = 0;
    this.service.fds = 0;

    return this.save();
};

employeSchema.methods.resetTimeFn = function() {

    this.service.workingTime = 0
    this.isService = false
    this.service.pds = 0;
    this.service.fds = 0;
    this.reanimation = 0;
    this.resetTime  = Date.now()
    return this.save()

}

employeSchema.methods.addRea = function(value){

    this.reanimation += value
    return this.save()
}

employeSchema.methods.removeRea = function(value){
    this.reanimation -= value
    return this.save()
}

employeSchema.methods.addTime = function(value){
    this.service.workingTime += value
    return this.save()
}

employeSchema.methods.removeTime  = function(value){
    this.service.workingTime -= value
    return this.save()
}




module.exports = mongoose.model('employe',employeSchema)
