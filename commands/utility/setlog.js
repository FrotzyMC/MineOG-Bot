const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success } = require('../../utils/embed');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder().setName('setlog').setDescription('Set log channel')
        .addChannelOption(o => o.setName('channel').setDescription('Channel').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const ch = interaction.options.getChannel('channel');
        await db.set(`log_channel_${interaction.guild.id}`, ch.id);
        interaction.reply({ embeds: [success('Done', `Logs will go to ${ch}`)] });
    }
};
