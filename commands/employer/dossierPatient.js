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
                    {name: "35K", value: "35000"},
                              {name: "75K", value: "75000"},
                    )
                .setRequired(true)
        )
        .addBooleanOption(option =>
        option
            .setName('facture-payer')
            .setDescription('Le patient a til payer la facture? ')
            .setRequired(true))

        .addStringOption(option =>
            option
                .setName('symptome')
                .setDescription('Indiquez les different symptome du patient ')
                .setRequired(true))

        .addStringOption(option =>
            option
                .setName('post-traitement')
                .setDescription('Indiquez les different traitement/exercice de reeducation prescris au patienst ')
                .setRequired(true))


        .addAttachmentOption(option =>
        option
            .setName('carte-identité')
            .setDescription('uploader la carte d\'identité')
            .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName('note-complementaire')
                .setDescription('Indiquez une note complémentaire si necessaire'))
        .addUserOption(option =>
        option
            .setName('ambulancier')
            .setDescription('Mentionnerl\'ambulancier'))

        .addUserOption(option =>
            option
                .setName('chirurgiens')
                .setDescription('Mentionner le chirurgiens'))

        .addUserOption(option =>
            option
                .setName('infirmier')
                .setDescription('Mentionner l\'infirmier'))
        .addUserOption(option =>
            option
                .setName('anesthesite')
                .setDescription('Mentionner l\'anesthesiste'))
        .addUserOption(option =>
            option
                .setName('medecin')
                .setDescription('Mentionner le medecin'))
   ,

    async execute(interaction) {

        const {member, options, user, client} = interaction
        const verifEmployeRoles = member.roles.cache.find(r => r.id=== config.role.EmergencyRescue)
        const verifDbEmploye = await employe.findOne({id: member.id})
        let name, prenom, cause, identity, partnerMember, facture, factureIsPaid,ambulancier,medecin, chirugiens, infirmier, anesthesite, symptome, postTraitement, noteCplmt , met1, met2, met3, met4;
        name = options.getString('nom')
        prenom = options.getString('prenom')
        cause = options.getString('cause')
        identity = options.getAttachment('carte-identité')
        partnerMember = options.getUser('coéquipier') ?  options.getUser('coéquipier') : null
        facture = options.getString('facture')
        factureIsPaid = options.getBoolean('facture-payer')
        ambulancier = options.getUser('ambulancier')
       medecin = options.getUser('medecin')
        chirugiens = options.getUser('chirurgiens')
        infirmier = options.getUser('infirmier')
        anesthesite = options.getUser('anesthesite')
        symptome = options.getString('symptome')
        postTraitement = options.getString('post-traitement')
        noteCplmt = options.getString('note-complementaire')
        let verifyAgent = []
        let jobOn  = []
        const jobsUse = interaction.options._hoistedOptions;

         jobsUse.forEach((job) => {

            if(job.type !== 6) return
            console.log(job.name)
            const jobId = Object.values(config.roles.metier).find(role => role.name === job.name)?.id
            if (!jobId) return
             jobOn.push(jobId)
        })



        const dossier = {    nom: name, prenom, cause, identity: identity.url, partner : partnerMember ? partnerMember.id : null , montant: facture, facturePaid: factureIsPaid, agent: member.id }
        const verifyAgentFunct =  async  (chir, inf, anes, med, ambu) => {
            const allJob = [chir, inf, anes, med, ambu]

            allJob.forEach((job) => {
                 if(job=== null) return

                verifyAgent.push(job.id)


            })


        }


        await verifyAgentFunct(chirugiens, infirmier, anesthesite, medecin, ambulancier)

        if(!verifEmployeRoles || !verifDbEmploye) return interaction.reply({content: 'Vous n\'ête pas ems, vous ne' +
                'pouvez pas effectuez cette commande'})









        for (const el of verifyAgent) {
            const partnerDb = await  employe.findOne({id: el})
            if(!partnerDb) interaction.reply({content: "Le coequipier selectionner n'est pas un ems. "});
            partnerDb.reanimation += 1
            await partnerDb.save()
                   }
        verifDbEmploye.reanimation += 1
        await  verifDbEmploye.save()

        await dossierDb.create(dossier).then((resp) => console.log(resp), {upsert: true})


        const intervenant = verifyAgent.map((int) => `<@${int}>` ).join('\n')
        const skillJob = jobOn.map((metier) => `<@&${metier}>` ).join('\n')
        const embed = new EmbedBuilder()
            .setTitle(`DOSSIER PATIENT 『${name} - ${prenom}』`)
            .setDescription(`
             Ajout d'un nouveau dossier patient. 
             
# ◈ ━━━━━━━━ ◆ ━━━━━━━━ ◈
#  INFORMATION PATIENT
> - Nom patient: \`\`${name.toUpperCase()}\`\`
> - Prénom patient:  \`\`${prenom.toUpperCase()}\`\`
> - Cause du coma:  \`\`${cause.toUpperCase()}\`\`
> - Date:  \`\`${new Date(Date.now()).toLocaleDateString()}\`\`
# ◈ ━━━━━━━━ ◆ ━━━━━━━━ ◈             
# SUIVI MEDICAL: 
> - Symptome: \`\`${symptome.toUpperCase()}\`\`
> - Traitement: \`\`${postTraitement.toUpperCase()}\`\`

> - INTERVENANT: \n ${intervenant}
  
> - Metier des intervenant: \n ${skillJob}

        
# ◈ ━━━━━━━━ ◆ ━━━━━━━━ ◈             
# FACTURATION             
> - Montant de la facture: \`\`${facture} $\`\`
> - Facture payer: ${factureIsPaid ? "**OUI**" : "**NON**"}
# ◈ ━━━━━━━━ ◆ ━━━━━━━━ ◈
             
             
             
             
             
             `)
            .setFooter({text: `Dossier valider par: ${client.user.username}`, iconURL: member.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            .setThumbnail(member.displayAvatarURL({dynamic: true}))
            .setColor('Random')
            .setImage(identity.url)

        interaction.reply({embeds: [embed]})


    }
}