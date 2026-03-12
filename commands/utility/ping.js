const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Check latency'),
    async execute(interaction) {
        const sent = await interaction.reply({ embeds: [info('Pinging...', '...')], fetchReply: true });
        interaction.editReply({ embeds: [info('Pong! 🏓', `Latency: **${sent.createdTimestamp - interaction.createdTimestamp}ms**\nAPI: **${interaction.client.ws.ping}ms**`)] });
    }
};
