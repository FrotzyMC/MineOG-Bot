const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('coinflip').setDescription('Flip a coin'),
    async execute(interaction) {
        interaction.reply({ embeds: [info('🪙 Coin Flip', Math.random() < 0.5 ? 'Heads!' : 'Tails!')] });
    }
};
