const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { info } = require('../../utils/embed');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings').setDescription('View warnings for a user')
        .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const warns  = (await db.get(`warns_${interaction.guild.id}_${target.id}`)) ?? [];
        if (!warns.length) return interaction.reply({ embeds: [info('No Warnings', `${target.tag} has no warnings.`)] });
        interaction.reply({ embeds: [info(`Warnings — ${target.tag}`, warns.map((w,i) => `**${i+1}.** ${w.reason} — by ${w.by}`).join('\n'))] });
    }
};
