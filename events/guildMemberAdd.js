const {Events, AttachmentBuilder} = require('discord.js');
const {createCanvas, Image} = require('@napi-rs/canvas');
const dbCitizen = require('../models/citoyen')
const cv = require('../models/cv')

module.exports = {
    name: 'guildMemberAdd',

    async execute(interaction) {


        //Variable
        const {  member, user } = interaction
        const citizen = await dbCitizen.findOne({id: user.id })

        if(!citizen) {
            const body = {
                name: user.username,
                id: user.id,
                avatar: user.avatarURL({extension:'png', size:1024})

            }

              await dbCitizen.create(body)
                .then((data)=> {
                    console.log(data)
                }, {upsert:true})








        }




    return console.log("ok")



    },
}



