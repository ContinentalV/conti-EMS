const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const dossPatien = require('../../models/dossPatient')
const ObjectId = require('mongoose').Types.ObjectId
const axios = require("axios");
const dayjs = require('dayjs')



module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-doss-patient')
        .setDescription('Récupère les information sur un patient.')
        .addStringOption(option =>
            option
                .setName('nom')
                .setDescription("indiquez le nom & prenom du patient")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('prenom')
                .setDescription("indiquez le nom & prenom du patient")
                .setRequired(true)
        )
    ,


    async execute(interaction) {

        const {options, user, member, guild, client } = interaction;
        let name, nickname;

        name = options.getString('nom')
        nickname = options.getString('prenom')
        let test =[]




        const patientFolder  = await dossPatien.find({nom: name,prenom: nickname }).sort({_id: -1}).limit(10)
        if(patientFolder.length <1) return interaction.reply({embeds: [new EmbedBuilder().setColor('Red').setDescription('Aucun dossier trouvé a ce nom: ' + name.toUpperCase() + ' ' + nickname.toUpperCase())], ephemeral:true})
        let ci = patientFolder[0].identity
        patientFolder.map( (doss) => {
         test.push(doss.extractDataFromDocument())
        })
        console.log("Taille tableau" + test.length)

        const fieldsToAdd = test.map((x, index) => {
            return {
                name: `# ━━━━━━━━━━━━━━❪<:Ambulance43:1151624934326554634>❫━━━━━━━━━━━━━━  #`,
                value: ` 
                
- Date : \`\` ${x.date} \`\`
- Cause : \`\`${x.cause}\`\`
- Symptômes : \`\`${x.symptome}\`\`
- Post-traitement :\`\`${x.postTraitement}\`\`
- Note complémentaire :\`\`${x.noteCplmt !== null ? x.noteCplmt : "Pas de note complémentaire" }\`\`               
- ${x.intervenant !== "" ? `Intervenant: ${x.intervenant}` : "Pas d'intervant déclarer"}`,
            };
        });


        // MAP A FAIRE
        const embed = new EmbedBuilder()
            .setTitle("DOSSIER DE " + name.toUpperCase() + ' ' + nickname.toUpperCase())
            .setColor('Random')
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
            .setFooter({text: 'Request by ' + member.nickname, iconURL: member.displayAvatarURL({dynamic: true})})
            .setDescription(`Ci dessous vous retrouverez le suivis du patient demander (Les 10 dernier dossier de ce patient seront afficher)`)
            .addFields(fieldsToAdd)
            .setImage(ci)
             interaction.reply({embeds: [embed]})





    }
}