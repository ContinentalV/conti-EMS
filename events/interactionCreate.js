const {Events, EmbedBuilder} = require('discord.js');
const dayjs = require("dayjs");
const absenceDB = require('../models/absence')
const employerDB = require('../models/employe')
const {tsToMin, minToHeure } = require('../function/functions')
const customParseFormat = require('dayjs/plugin/customParseFormat');
const config = require('../config')
dayjs.extend(customParseFormat);


module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const {guild, member, client, options, user} = interaction
        const now = Date.now()

        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction)
            } catch (error) {
                console.error(`Error executing command ${interaction.commandName}: ${error}`);
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.autocomplete(interaction)
            } catch (error) {
                console.error(`Error executing command ${interaction.commandName}: ${error}`);
            }
        }else  if (interaction.isUserContextMenuCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction)
            } catch (error) {
                console.error(`Error executing command ${interaction.commandName}: ${error}`);
            }
        }else  if (interaction.isModalSubmit()) {
            const errorFormatEmbed = new EmbedBuilder()
                .setColor("DarkRed")
                .setFooter({text: "Veuillez mettre la date au format: DD/MM/YYYY", iconURL: client.user.displayAvatarURL({dynamic:true})})

            if (interaction.customId === 'absence') {
                const verifAbsenceForUser = await absenceDB?.find({id: user.id})







                const reason = interaction.fields.getTextInputValue('reason');
                const start = interaction.fields.getTextInputValue('départ')
                const back = interaction.fields.getTextInputValue('retour')
                const regexDate = /^\d{2}\/\d{2}\/\d{4}$/;
                const isValidStartDate = regexDate.test(start);
                const isValidBackDate = regexDate.test(back);


                if(verifAbsenceForUser[verifAbsenceForUser.length - 1]?.back > now) return interaction.reply({content: "Vous avez déja une absence en cours. Votre absence ce termine le [date a mettre], donc  ** Vous ne pouvez pas redeposer d'aabsence tant que celle ci n'est pas compléter.**", ephemeral:true})

                if (!isValidStartDate || !isValidBackDate) return interaction.reply({embeds: [errorFormatEmbed], ephemeral:true})

                const StartTimestamp = dayjs(start, 'DD/MM/YYYY').unix() * 1000
                const BackTimestamp = dayjs(back, 'DD/MM/YYYY').unix() * 1000
                let calculDuration = tsToMin(BackTimestamp - StartTimestamp)
                let absenceDuration =  minToHeure(calculDuration)
                let duration =    absenceDuration.days

                if (StartTimestamp < now) return interaction.reply({content: "Vous ne pouvez pas poser une absence avec une date antérieur a la date actuelle.", ephemeral:true})
                if (duration > 15 ) return interaction.reply({content: "Vous ne pouvez pas déposer une absence de plus de 15 Jours. Cela entrainera un licensciement. Si vous avez des raisons assez exceptionnel, vous pouvez demander une dérogation au @Pdg. Cependant, ils ne sont pas dans l'obligation d'accepter votre requête. ", ephemeral:true})

                const isActiveAbsence = now >= StartTimestamp ? true : false
                const targetEms = await employerDB.findOne({id: user.id})
                console.log(targetEms.absence)
                await absenceDB.create({
                    id: user.id,
                    name: targetEms.matricule,
                    raison: reason,
                    start: StartTimestamp,
                    back: BackTimestamp,
                    active: isActiveAbsence,
                })


                const startIn =minToHeure(tsToMin(StartTimestamp - now))
                targetEms.absence.push({start: StartTimestamp, back:BackTimestamp, absenceTime:duration});
                await targetEms.save()

                const validateEmbed = new EmbedBuilder()
                    .setAuthor({name: `Déclaration d'une absence: ${member.nickname ? member.nickname : user.username }`, iconURL: member.displayAvatarURL({dynamic: true})})
                    .setDescription(`> - ${member} <@&${member.roles.highest.id}>\n>  - **Date de départ: [${start}]** \n>  - **Date de retour: [${back}]**\n> -  Raison: ${reason}\n> - Temps de l'absence: ${duration} Jours\n> - Commence dans: ${startIn.days} Jours`)
                    .setThumbnail(targetEms.avatar)
                    .setColor("Random")
                    .setTimestamp()
                    .setFooter({text: "CN5 EMS", iconURL: client.user.displayAvatarURL({dynamic:true})})
                    guild.channels.cache.get(config.channel.absence).send({content: `<@&${config.role.Direction}>`,embeds: [validateEmbed]})
                    await interaction.reply({content: "Votre absence vient d'être envoyer dans le channel absence. Voici ci dessous un aperçu:",embeds: [validateEmbed], ephemeral:true});

            }
        }




    }
}