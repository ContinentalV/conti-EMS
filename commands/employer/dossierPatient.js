const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const config = require('../../config')
const employe = require('../../models/employe')
const dossierDb = require('../../models/dossPatient')




module.exports = {
    data: new SlashCommandBuilder()
        .setName('dossier-patient')
        .setDescription('Dépose un dossier patient')
        .addStringOption(option =>
            option
                .setName('nom')
                .setDescription('Indiquez le nom')
                .setRequired(true)
        )
        .addStringOption(option =>
        option
            .setName('prenom')
            .setDescription('Indiquez le prénom')
            .setRequired(true)
        )
        .addStringOption(option =>
        option
            .setName('cause')
            .setDescription('Indiquez la cause de la mort')
            .addChoices(
                {name: "Par balle", value: "Par balles"},
                {name: "Chute", value: "Chute"},
                {name: "Accident de voiture", value: "Accident de voiture"},
                {name: "Inconnue", value: "Cause inconnue"},
                {name: "Faim - Soif", value: "Faim/soif"},
                {name: "Babayaga", value: "Babayaga"},
                {name: "je sais pas si ya autre chose", value: "idk"},
            )
            .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName('facture')
                .setDescription('Indiquez le montant de la facture')
                .addChoices(
                    {name: "75K", value: "75000"},
                    {name: "150K", value: "150000"},
                    )
                .setRequired(true)
        )
        .addBooleanOption(option =>
        option
            .setName('facture-payer')
            .setDescription('Le patient a til payer la facture? ')
            .setRequired(true))


        .addAttachmentOption(option =>
        option
            .setName('carte-identité')
            .setDescription('uploader la carte d\'identité')
            .setRequired(true)
        )
        .addUserOption(option =>
        option
            .setName('coéquipier')
            .setDescription('Mentionner votre coequipier')),

    async execute(interaction) {

        const {member, options, user, client} = interaction
        const verifEmployeRoles = member.roles.cache.find(r => r.id=== config.role.EmergencyRescue)
        const verifDbEmploye = await employe.findOne({id: member.id})
        let name, prenom, cause, identity, partnerMember, facture, factureIsPaid;
        name = options.getString('nom')
        prenom = options.getString('prenom')
        cause = options.getString('cause')
        identity = options.getAttachment('carte-identité')
        partnerMember = options.getUser('coéquipier') ?  options.getUser('coéquipier') : null
        facture = options.getString('facture')
        factureIsPaid = options.getBoolean('facture-payer')

        const dossier = {    nom: name, prenom, cause, identity: identity.url, partner : partnerMember ? partnerMember.id : null , montant: facture, facturePaid: factureIsPaid, agent: member.id }






        if(!verifEmployeRoles || !verifDbEmploye) return interaction.reply({content: 'Vous n\'ête pas ems, vous ne' +
                'pouvez pas effectuez cette commande'})
         if(partnerMember !== null) {
           const partnerDb =await  employe.findOne({id: partnerMember.id})
             console.log(partnerDb)
            if(!partnerDb) return interaction.reply({content: "Le coequipier selectionner n'est pas un ems. " })
            partnerDb.reanimation += 1
            await partnerDb.save()
        }

        verifDbEmploye.reanimation += 1
        await  verifDbEmploye.save()

        await dossierDb.create(dossier).then((resp) => console.log(resp), {upsert: true})



        const embed = new EmbedBuilder()
            .setTitle(`DOSSIER PATIENT 『${name} - ${prenom}』`)
            .setDescription(`
             Ajout d'un nouveau dossier patient. 
             
             ◈ ━━━━━━━━ ◆ ━━━━━━━━ ◈
             > - Nom patient: \`\`${name.toUpperCase()}\`\`
             > - Prénom patient:  \`\`${prenom.toUpperCase()}\`\`
             > - Cause du coma:  \`\`${cause.toUpperCase()}\`\`
             > - Date:  \`\`${new Date(Date.now()).toLocaleDateString()}\`\`
             > - Montant de la facture: \`\`${facture} $\`\`
             > - Facture payer: ${factureIsPaid ? "**OUI**" : "**NON**"}
             ◈ ━━━━━━━━ ◆ ━━━━━━━━ ◈
             
             Agent: ${member} - <@&${member.roles.highest.id}>
             Coéquipier:  ${partnerMember ?  ` ${partnerMember} ` : 'aucun'}
             
             `)
            .setFooter({text: `Dossier valider par: ${client.user.username}`, iconURL: member.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            .setThumbnail(member.displayAvatarURL({dynamic: true}))
            .setColor('Random')
            .setImage(identity.url)

        interaction.reply({embeds: [embed]})


    }
}