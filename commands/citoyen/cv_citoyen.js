const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const cv = require('../../models/cv')
const cit = require('../../models/citoyen')
const config = require('../../config')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cv')
        .setDescription('permet de déposer un cv via le bot ems.')
        .addStringOption(option =>
        option
            .setName('disponnibilite')
            .setDescription('Veuillez selectionner le type de contrat souhaité.')
            .setRequired(true)
            .addChoices(
                {name: "douze heures / semaines", value: '12'},
                        {name: "vingt-quatre heures  / semaines", value: '24'},
                        {name: "trente cinq heures / semaines", value: '35'}
            )

        )

        .addStringOption(option =>
        option
            .setName('nom')
            .setDescription('Indiquez votre nom')
            .setRequired(true)

        )
        .addStringOption(option =>
            option
                .setName('prenom')
                .setDescription('Indiquez votre prénom')
                .setRequired(true)

        )
    .addNumberOption(option =>
        option
            .setName('age-rp')
            .setDescription('Indiquez votre age RP')
            .setRequired(true)

    )
        .addNumberOption(option =>
            option
                .setName('age-hrp')
                .setDescription('Indiquez votre nom')
                .setRequired(true)

        )
        .addStringOption(option =>
            option
                .setName('qualite-1')
                .setDescription('indique ta premiere qualité en 1 mot')
                .setRequired(true)

        )
        .addStringOption(option =>
            option
                .setName('qualite-2')
                .setDescription('indique ta premiere qualité en 1 mot')
                .setRequired(true)

        )
        .addStringOption(option =>
            option
                .setName('qualite-3')
                .setDescription('indique ta premiere qualité en 1 mot')
                .setRequired(true)

        )
        .addStringOption(option =>
            option
                .setName('default-1')
                .setDescription('indique ton premier default en 1 mot')
                .setRequired(true)

        )
        .addStringOption(option =>
            option
                .setName('default-2')
                .setDescription('indique ton deuxieme default en 1 mot')
                .setRequired(true)

        )
        .addStringOption(option =>
            option
                .setName('default-3')
                .setDescription('indique ton troisième default en 1 mot')
                .setRequired(true)

        )
        .addStringOption(option =>
        option
            .setName('derniere-infraction')
            .setDescription('veuillez selectionner a quand remontre votre dernier infraction')
            .setRequired(true)
            .addChoices(
                {name: "Aujourd'hui", value: 'today'},
                {name: 'il y a 1 semaine ou plus', value: "week" },
                {name: 'Il y a plus d\'un mois', value: "month"},
                {name: "Je n'ai jamais eu de casier", value: "none"}
            )
        )
        .addStringOption(option =>
            option
                .setName('casier')
                .setDescription('veuillez indiquer la date et le motif de votre infraction la plus grosse ')
                .setRequired(true)

        )
        .addStringOption(option =>
            option
                .setName('motivation')
                .setDescription('veuillez indiquer vos motivations')
                .setRequired(true)

        )
        .addStringOption(option =>
            option
                .setName('competence')
                .setDescription('veuillez indiquer vos compétences')
                .setRequired(true)

        )
        .addStringOption(option =>
            option
                .setName('experience')
                .setDescription('Indiquer les metiers que vous avez déja expérimenter. ')
                .setRequired(true)


        )
        .addStringOption(option =>
            option
                .setName('pourquoi-vous')
                .setDescription('indiquez pourquoi vous et pas un autre ')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('liens-cv')
                .setDescription('Si vous avez un cv sur google doc ou autre site, vous pouvez le partager en complément')               )
        .addAttachmentOption(option =>
            option
                .setName('cv-img')
                .setDescription('Si vous avez un cv en png ou autre format img vous pouvez le partager en complément')               ),



    async execute(interaction) {
        const {options, member, guild, client, user} = interaction;
        let nom, prenom, age, disponnibilite, qualiteDefault, experience, motivation, casier, skill, whyYou, annexe, avatar, id;
        avatar = user.avatarURL({extension:'png', size: 1024})
        console.log("L'avatar: " + avatar)
        nom = options.getString('nom')
        prenom = options.getString('prenom')
        age = [options.getNumber('age-rp'), options.getNumber('age-hrp')]
        disponnibilite = options.getString('disponnibilite')
        let q1, q2,q3, d1,d2,d3;
        q1 = options.getString('qualite-1')
        q2 = options.getString('qualite-2')
        q3 = options.getString('qualite-3')
        d1 = options.getString('default-1')
        d2 = options.getString('default-2')
        d3 = options.getString('default-3')
        qualiteDefault = [q1, q2,q3, d1,d2,d3]

        motivation = options.getString('motivation')
        casier = [options.getString('derniere-infraction'),options.getString('casier') ]
        skill = options.getString('competence')
        whyYou = options.getString("pourquoi-vous")
        experience = options.getString('experience')
        annexe = [options.getAttachment('cv-img'), options.getString('liens-cv')  ]
        const citoyen = await cit.findOne({id: user.id}).populate('cv')

        const objCitoyen = citoyen?._id
         const body = {citoyen: objCitoyen, nom, prenom, age, disponnibilite, qualiteDefault, motivation, casier, skill, whyYou, annexe, experience, avatar, id: user.id}



        if(citoyen.cv !== null) return console.log('deja un cv en cours')
        const cvDetails = await cv.create(body)
        citoyen.cv = cvDetails._id
        citoyen.save()


        //setTimeout(async()=> console.log(await citoyen.populate('cv')), 10000)
        const description = `
        **[DEPOT CV CANDIDATURE EMS #2023]**
        
        *Nous vous remercions d'avoir déposer votre cv, et nous vous recontacterons dans les plus bref delais*
        
        > Récapitulatif de vos informations:\n
        
        - **Nom:** ${nom}
        - **Prenom:** ${prenom}
        - **Age:** RP: ${age[0]} - HRP: ${age[1]}
        - **vos disponnibilité:** ${disponnibilite} Heures/Semaines
        - **Casier:** \n > dernière infraction: ${casier[0]}\n > Motif: ${casier[1]}\n            
        `

        const fields =[
            {name: 'Qualité', value: `- ${q1}\n- ${q2}\n- ${q3}`, inline: true},
            {name: 'Default', value: `- ${d1}\n- ${d2}\n- ${d3}`, inline: true},
            {name: 'Skills', value: `${skill}`, inline: false},
            {name: 'Experience', value: `${experience}`, inline: true},
            {name: 'Motivation', value:  `${motivation}`, inline: true},
            {name: 'Pourquoi vous ?', value: `${whyYou}`, inline: false}

        ];


        const embeds = new EmbedBuilder()
            .setDescription(description)
            .setFooter({text: client.user.username, iconURL: member.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            .setThumbnail(member.displayAvatarURL({dynamic: true}))
            .addFields(fields.map(field => field) )
            .setColor('Random')

        member.roles.add(config.role.attEntretien)
        const channel = client.channels.cache.get(config.channel.logscv)
        channel.send({content: "Un nouveau cv vient d'être envoyer: " + nom + ' ' + prenom +  ' le: ' + new Date(Date.now()).toLocaleDateString()})
        return interaction.reply({content: `- <@${member.id}> Merci d'avoir déposer un cv. Nous vous recontacterons dans les plus bref délais. Ci dessous un aperçu de votre cv.\n- Je tiens à vous préciser que toute les informations indiquer dans le cv doivent être juste. En ce qui concerne votre casier: nous procederons à une vérification par les services de police.\n- Veuillez verifier les différente disponnibilité des ressources humaines.` , embeds: [embeds], ephemeral: true})


    }
}