const {SlashCommandBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder} = require('discord.js')
const config = require("../../config");
/**
 * @command /add-formations
 * @description Cette commande permet d'appliquer les formations réussi par un employer (direction) .
 * @usage /add-formations -> {ambu / chir}
 */


module.exports = {
    data: new SlashCommandBuilder()
        .setName('cr-eval')
        .setDescription('ajoute les formation sur le profil de l\'employe')

        .addUserOption(option =>
            option
                .setName('agent-ems')
                .setDescription("Indiquez l'agent ems en formation")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('selection-procedure')
                .setDescription('Choisissez la/les procédure evaluer')
                .setRequired(true)
                .addChoices(
                    {name:'Ambulance', value: 'ambu'},
                            {name:"Chirugie", value: "chir"},
                            {name:"administratif", value: "adminstratif"},
                            {name: "social", value:"social"}
                )
        )
        .addStringOption(option =>
            option
                .setName('appreciation')
                .setDescription('Indiquez votre appreciation sur la formation de cette employer.')
        )
    ,
    async execute(interaction) {

        const {options, user, member, client, guild} =  interaction;

        let agent, forma, appreciation;
        agent = options.getUser('agent-ems')
        forma = options.getString('selection-procedure')
        appreciation = options.getString('appreciation')

        console.log(agent.id)

        const embedCR = new EmbedBuilder()
            .setTitle('Fiche de notation - Formation')
            .setDescription(`
        Agent EMS: 
        Type de formation: 
        Appreciation du Formateur: 
        
        `)
            .setFooter({text: `Evaluez par: ${user.username}`, iconURL:member.displayAvatarURL({dynamic:true})})
            .setColor('Random')


        interaction.reply({embeds: [embedCR]})




    }
}
