const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode').setDescription('Set slowmode')
        .addIntegerOption(o => o.setName('seconds').setDescription('0 to disable').setRequired(true).setMinValue(0).setMaxValue(21600))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const s = interaction.options.getInteger('seconds');
        await interaction.channel.setRateLimitPerUser(s);
        interaction.reply({ embeds: [success('Slowmode', s === 0 ? 'Disabled.' : `Set to **${s}s**`)] });
    }
};
