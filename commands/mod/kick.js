const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success, error } = require('../../utils/embed');
const { log } = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick').setDescription('Kick a member')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Reason'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        if (!target?.kickable) return interaction.reply({ embeds: [error('Error', 'Cannot kick that user.')], ephemeral: true });
        await target.kick(reason);
        await log(interaction.guild, 'mod', `👢 **${target.user.tag}** kicked by **${interaction.user.tag}** — ${reason}`);
        interaction.reply({ embeds: [success('Kicked', `**${target.user.tag}** kicked.\nReason: ${reason}`)] });
    }
};
