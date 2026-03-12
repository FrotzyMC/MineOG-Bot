const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success } = require('../../utils/embed');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarns').setDescription('Clear all warnings for a user')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        await db.delete(`warns_${interaction.guild.id}_${target.id}`);
        interaction.reply({ embeds: [success('Cleared', `All warnings cleared for **${target.tag}**`)] });
    }
};
