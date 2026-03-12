const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('serverinfo').setDescription('Server info'),
    async execute(interaction) {
        const g = interaction.guild;
        interaction.reply({ embeds: [info(g.name, `**Owner:** <@${g.ownerId}>\n**Members:** ${g.memberCount}\n**Channels:** ${g.channels.cache.size}\n**Roles:** ${g.roles.cache.size}\n**Created:** <t:${Math.floor(g.createdTimestamp/1000)}:D>`).setThumbnail(g.iconURL({ dynamic: true }))] });
    }
};
