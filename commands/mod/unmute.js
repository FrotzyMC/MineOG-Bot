const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success, error } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute').setDescription('Remove timeout from a member')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        if (!target) return interaction.reply({ embeds: [error('Error', 'User not found.')], ephemeral: true });
        await target.timeout(null);
        interaction.reply({ embeds: [success('Unmuted', `**${target.user.tag}** has been unmuted.`)] });
    }
};
