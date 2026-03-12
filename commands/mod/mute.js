const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success, error } = require('../../utils/embed');

const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
const parse = s => { const m = s.match(/^(\d+)([smhd])$/); return m ? +m[1] * units[m[2]] : null; };

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute').setDescription('Timeout a member')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
        .addStringOption(o => o.setName('duration').setDescription('e.g. 10m 1h 2d').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Reason'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const durStr = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const ms     = parse(durStr);
        if (!ms) return interaction.reply({ embeds: [error('Error', 'Use e.g. 10m, 1h, 2d')], ephemeral: true });
        if (!target?.moderatable) return interaction.reply({ embeds: [error('Error', 'Cannot mute that user.')], ephemeral: true });
        await target.timeout(ms, reason);
        interaction.reply({ embeds: [success('Muted', `**${target.user.tag}** muted for **${durStr}**.\nReason: ${reason}`)] });
    }
};
