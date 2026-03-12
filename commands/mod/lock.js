const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock').setDescription('Lock this channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
        interaction.reply({ embeds: [success('Locked', 'Channel locked.')] });
    }
};
