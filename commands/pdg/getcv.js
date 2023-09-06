const {SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder} = require('discord.js')
const dbcv = require('../../models/cv')
const employe = require('../../models/employe')
const mongoose = require("mongoose");
const config = require("../../config");

// BODY MATRICULE ==> BUG A FINIR DE FIX
module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-cv')
        .setDescription('Envoie les information général de continental V.')
        .addStringOption(option =>
            option
                .setName('id')
                .setDescription("affiche le cv via son id")
        ),
    async execute(interaction) {

        const {member, guild, client, options, user} = interaction;
        const target = options.getString('id')
        const emmergencyRole= interaction.guild.roles.cache.find(role  => role.id === config.role.EmergencyRescue)
        const EMTrole =interaction.guild.roles.cache.find(role  => role.id === config.role.EMT)
        const attEntrRole =interaction.guild.roles.cache.find(role  => role.id === config.role.attEntretien)

        //####### BUTTON #############
        const confirm = new ButtonBuilder()
            .setCustomId("confirm")
            .setLabel('Accepter')
            .setStyle(ButtonStyle.Success)
            .setEmoji('1111523948077789244')
        const reject = new ButtonBuilder()
            .setCustomId("refuser")
            .setLabel('Refuser')
            .setStyle(ButtonStyle.Danger)
        const signContrat = new ButtonBuilder()
            .setCustomId("signcontrat")
            .setLabel('Lu et approuvé.')
            .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder()
            .addComponents(reject, confirm);


        const rowContrat = new ActionRowBuilder()
            .addComponents(signContrat)

        //#######  LIST CV ###########
       let listcv = await dbcv.find();

        if (!target) {

            const mappingData = listcv.length >= 1 ? listcv.map((cv) => ` id -> \`\`${cv._id} \`\`\nNom: ${cv.nom}\nPrénom: ${cv.prenom}  `).join(`\n\n`) : `Pas de cv en bdd`
            const embeds = new EmbedBuilder()
                .setDescription(mappingData)
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
                .setAuthor({name: `Request by: ${member.nickname} `, iconURL: member.displayAvatarURL({dynamic: true})})
                .setColor('Random')
                return  interaction.reply({embeds: [embeds]})
        }



        //########## FULL CV ##########
        const targetCV = await dbcv.findById(target)
        const infoGeneral = `
**Nom: **${targetCV.nom}
**Prénom:**  ${targetCV.prenom}
**Age:**
> - RP ->   ${targetCV.age[0]} ans
> - HRP -> ${targetCV.age[1]} ans
\n
**Dernière infraction connu:**  ${targetCV.casier[0]}
**Casier:**    ${targetCV.casier[1]}
`

const fields = [
    {name: `Qualitées`, value: `>>> - ${targetCV.qualiteDefault.slice(0, 3).join('\n- ')}`, inline: true},
    {name: `Défauts`, value: `>>> -  ${targetCV.qualiteDefault.slice(3, 6).join('\n- ')}`, inline: true},
    {name: `Quels sont vos motivatitions?`, value: `-  ${targetCV.motivation}`, inline: false},
    {name: `Quels sont vos Compétence?`, value: `-  ${targetCV.skill}`, inline: false},
    {name: `Quels sont vos experience?`, value: `-  ${targetCV.experience}`, inline: false},
    {name: `Pourquoi vous?`, value: `-  ${targetCV.whyYou}`, inline: true},
]
const embeds = new EmbedBuilder()
    .setDescription(infoGeneral)
    .setTimestamp()
    .setThumbnail(targetCV.avatar ? targetCV.avatar : "https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg")
    .addFields(fields.map((field) => field))
    .setAuthor({name: `Request by: ${member.nickname} `, iconURL: member.displayAvatarURL({dynamic: true})})
    .setColor('Random')
     const response = await interaction.reply({embeds: [embeds], components: [row]})


        //############ Collector Response Button: Delete cv & reject or accepte EMS #########
        const collectorFilter = i => i.user.id ===  user.id;
        try{
            const confirmation = await response.awaitMessageComponent({filter: collectorFilter, time:60_000})

            if (confirmation.customId === 'confirm'){
                //###### ROLE A METTRE ##########

                const roles = [emmergencyRole, EMTrole]
                // ####### CREATION DU PROFIL EMS ##########
                const body = {
                   id: targetCV.id ,
                   nom: targetCV.nom  ,
                   prenom: targetCV.prenom ,
                   avatar: targetCV.avatar,
                   grade:  100,
                    matricule: `${roles[1].name}. ${targetCV.nom} ${targetCV.prenom} `
                }
                // ,
                //     ${roles[1].name}.                matricule: `${roles[1].name}. ${targetCV.nom} ${targetCV.prenom} `


                //EMBEDS ACCEPT
                const acceptEmbed = new EmbedBuilder()
                    .setColor('DarkGreen')
                    .setTitle('CV ACCEPTER PAR ' + member.nickname)
                    .setTimestamp()
                    .setDescription(`
                    - ** ${body.id} - ${targetCV.nom} ${targetCV.prenom}**
                    - <@${targetCV.id}> -> Role applique: <@&${roles[0].id}> - <@&${roles[1].id}>
                    `)
                    .setThumbnail(targetCV.avatar)
                    .setFooter({text: `${client.user.username} -> confirmation du contrat`, iconURL: targetCV?.avatar})

                //Send Message privé to the new EMS
                const acceptDMEmbed  = new EmbedBuilder()
                        .setColor('DarkGreen')
                        .setTitle('CV ACCEPTER PAR ' + member.nickname)
                        .setDescription(`
                        Monsieur, 
                        
                        Par la présente, je vous informe que suite a votre entretiens, nous avons donnée un avis favorable. 
                        Nous vous souhaitons la bienvenue, dans l'hopital de los santos, au coté de l'equipe EMS. 
                       
                       >>> - Pour commencer vous allez devoir finaliser votre contrat. Voici ci dessous les étapes a suivres afin de pouvoir être officiellement EMS.
                        \n 
                        - Une fois que vous avez compris les termes de votre contrat vous devez signez electroniquement le mail en cliquant sur oui j'accepte ici --> <#1113545217782587496>
                        \n  
                        - Vous commencerez EMS test. Une formation vous sera proposé, cette formation est obligatoire elle comprend, la visite des locaux, les equipements a utiliser et leur mode d'emplois etc... 
                        - Vous devez connaitre prendre connaissance du règlement interieur que vous retrouverez ici: <#${config.channel.interiorRule}>
                        
                        - Le système de paie vous sera expliquer par les RH lors de votre intégration. 
                        - L'image de l'entreprise est très importante meme en dehors vos heure de service
                        
                        Cordialement, la direction    
                        `)
                        .setTimestamp()
                        .setThumbnail(client.user.displayAvatarURL({dynamic: true}))


                // ########## Envoie du mai l#########
                const TargetToSendDM = await interaction.guild.members.fetch(targetCV.id)
                TargetToSendDM.roles.add(emmergencyRole )
                TargetToSendDM.roles.add(EMTrole )
                TargetToSendDM.roles.remove(attEntrRole)

                  await TargetToSendDM.setNickname(body.matricule)
                TargetToSendDM.send({embeds: [acceptDMEmbed]})


                //Collector DM.

                //Send Logs-contrat (reflechir a quoi faire pour ca)

                const channel = await client.channels.cache.get(config.channel.logscontrat)
               await  channel.send({content: "Un nouveau ems vient d'arriver: "  + `${targetCV.nom} ${targetCV.prenom}` + ' le: ' + new Date(Date.now()).toLocaleDateString()})


                //#### Creation de l'emploi & supression du cv ##########
                await employe.create(body)
                await confirmation.update({content: `Mail to **${TargetToSendDM.nickname}** is sent !`,embeds: [acceptEmbed] , components: []})
                 await dbcv.findByIdAndDelete(targetCV._id)


            }
            else if (confirmation.customId ==='refuser'){
                const rejectDMEmbed  = new EmbedBuilder()
                    .setColor('DarkRed')
                    .setTitle('VOTRE CV A ETE REFUSER PAR NOS SERVICE RH ')
                    .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`
                        Monsieur, 
                        
                        Par la présente, je vous informe que suite a votre entretiens, nous avons donnée un avis **__defavorable.__** 
                         
                       
                       >>> - Vous retrouverez si dessous les différentes raisons possible: 
                        \n 
                        - Votre cv n'est pas remplis correctement                    
                        - Votre profil ne convient pas a nos critère. 
                        - Votre entretiens ne n'est pas très bien passer
                        - Vous etiez en retard, ou dans une tenu innaproprié.
                        - Vous avez un casier avec de grosse infraction il y a moins d'un mois.
                        
                        Cordialement, la direction    
                        `)
                    .setTimestamp()
                const TargetToSendDM = await interaction.guild.members.fetch(targetCV.id)

                TargetToSendDM.roles.remove(attEntrRole)
                TargetToSendDM.send({embeds: [rejectDMEmbed]})

                await dbcv.findByIdAndDelete(targetCV._id)
                await confirmation.update({ embeds: [new EmbedBuilder().setColor('DarkRed').setTimestamp().setTitle('Refus de cv par: ' + member.nickname).setFooter({text: `Vous avez supprimer le cv de ${targetCV?.nom} ${targetCV?.prenom}`, iconURL: targetCV?.avatar}) ], components: [] });
            }
        }catch(err){
            console.log(err.stack)
            console.log(err.stackTrace)
        await interaction.editReply({content: `Confirmation not received within 1 minute, cancelling`, components: [] })
        }



    }
}