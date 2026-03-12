const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success } = require('../../utils/embed');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn').setDescription('Warn a member')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const key    = `warns_${interaction.guild.id}_${target.id}`;
        const warns  = (await db.get(key)) ?? [];
        warns.push({ reason, by: interaction.user.tag, at: new Date().toISOString() });
        await db.set(key, warns);
        interaction.reply({ embeds: [success('Warned', `**${target.tag}** warned.\nReason: ${reason}\nTotal: **${warns.length}**`)] });
    }
};
