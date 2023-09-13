const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const dayjs = require('dayjs');

const config = require('../config');

module.exports = {
    name: 'messageDelete',

    async execute(message) {
        console.log('Event triggered');
        if (message.member.user.bot) return;
        const date = Date.now();
        const guild = message.guild;
        const channelToSendLogs = guild.channels.cache.get(config.channels.logs.logsMsg);
        const format = 'DD-MM-YYYY HH:mm:ss';

        // Utilisez une fonction asynchrone pour récupérer deletUser
        async function getDeletUser() {
            // Récupère les logs d'audit pour trouver l'auteur de la suppression
            const auditLogs = await message.guild.fetchAuditLogs({ type: 72 });
            const entry = auditLogs.entries.first();
            const timestampLastAudit = dayjs(entry.createdAt).valueOf();

            const diff = date - timestampLastAudit;
            console.log('Resultat diff ' + diff);
            if (diff > 10000) {
                return message.member.id;
            } else {
                return entry.executorId;
            }
        }

        const deletUser = await getDeletUser(); // Attend que getDeletUser() soit terminé

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(' Suppression d\'un message ')
            .setTimestamp()

            .setDescription(`            
        > - **Metadata** 
        > Channels: <#${message.channel.id}>  
        > Auteur du message: <@${message.member.id}>
        > Supprimé par: <@${deletUser}>
        > Heure du message envoyé: \`\`${dayjs(message.createdTimestamp).format(format)}\`\`
        > Heure de suppression: \`\`${dayjs(Date.now()).format(format)}\`\`
         
         
        > - **Contenu du message **    
        Message supprimé:   \`\`${message.content}\`\`
      `);

        channelToSendLogs.send({ embeds: [embed] });
    },
};
