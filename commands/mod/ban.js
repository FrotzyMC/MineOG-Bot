const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success, error } = require('../../utils/embed');
const { log } = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban').setDescription('Ban a member')
        .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Reason'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        if (member && !member.bannable)
            return interaction.reply({ embeds: [error('Error', 'I cannot ban that user.')], ephemeral: true });

        await interaction.guild.members.ban(target, { reason });
        await log(interaction.guild, 'mod', `🔨 **${target.tag}** banned by **${interaction.user.tag}** — ${reason}`);
        interaction.reply({ embeds: [success('Banned', `**${target.tag}** has been banned.\nReason: ${reason}`)] });
    }
};
