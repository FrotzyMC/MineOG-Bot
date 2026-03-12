const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock').setDescription('Unlock this channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
        interaction.reply({ embeds: [success('Unlocked', 'Channel unlocked.')] });
    }
};
