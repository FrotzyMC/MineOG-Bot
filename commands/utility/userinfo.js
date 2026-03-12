const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('userinfo').setDescription('User info')
        .addUserOption(o => o.setName('user').setDescription('User (defaults to you)')),
    async execute(interaction) {
        const m = interaction.options.getMember('user') ?? interaction.member;
        const roles = m.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.toString()).join(', ') || 'None';
        interaction.reply({ embeds: [info(m.user.tag, `**ID:** ${m.id}\n**Joined:** <t:${Math.floor(m.joinedTimestamp/1000)}:D>\n**Created:** <t:${Math.floor(m.user.createdTimestamp/1000)}:D>\n**Roles:** ${roles}`).setThumbnail(m.user.displayAvatarURL({ dynamic: true }))] });
    }
};
