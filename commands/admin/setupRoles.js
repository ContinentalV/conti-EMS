const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const dbgrade = require('../../models/configGrades')
const config = require('../../config')


// Pour setup le truc -> creation deux deux roles limiteur 1 et 2 on met le limiteur 1 avant tout les role
// concerne et le 2 apres tout les roles concerner.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('grade-paye')
        .setDescription('Envoie des role souhaite en bdd.')
        .addRoleOption(option =>
        option
            .setName('limiteur-1')
            .setDescription('Choisissez le role limit en bas des role concerner')
        )

    .addRoleOption(option =>
        option
            .setName('limiteur-2')
            .setDescription('Choisissez le role limit au dessus des role concerner')
    ),
    async execute(interaction) {
        const {user, member, options, guild, client} = interaction
        const Startlimiteur = options.getRole('limiteur-1').position
        const Endlimiteur = options.getRole("limiteur-2").position
        const gradeInDb = await dbgrade.find()
        console.log(gradeInDb)

        if(gradeInDb.length === 0) {
            const roles = guild.roles.cache
            const roleEms = []

            roles.forEach((role) => {
                if ((role.position > Startlimiteur) && (role.position < Endlimiteur)) {
                    roleEms.push(role)
                }
            })

            for (const role of roleEms) {
                let  body = {
                    gradeId: role.id,
                    gradeName: role.name,
                    position: role.position,
                    gradeRatio: 0,
                    prime: false
                }

                await dbgrade.create(body)


            }

            const embeds = new EmbedBuilder()
                .setDescription(`
            Ci dessous la liste des roles qui on été ajouté en BDD afin de pouvoir configurer le montant/réanimation            
            ${roleEms.map(role => `  - Nom: ${role.name} \n- Id: ${role.id}`).join('\n\n')}
            \n
            > **Afin de pouvoir configurer les prix des réanimation pour chacun des grade veuillez utilisez la commande /tamere(jai pas encore reflechis au systeme)**
            `)
                .setColor('Random')
                .setTimestamp()

                 interaction.reply({embeds: [embeds]})
        } else {
            interaction.reply({content: "Vous ne pouvez pas ajoutez les role en bdd, ils existent déjà."})
        }









    }

}