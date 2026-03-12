const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../../utils/embed');

const questions = [
    ['fly','be invisible'],['always be cold','always be hot'],
    ['never sleep','never eat'],['be famous','be rich'],
    ['fight 100 duck-sized horses','fight 1 horse-sized duck'],
];

module.exports = {
    data: new SlashCommandBuilder().setName('wyr').setDescription('Would you rather'),
    async execute(interaction) {
        const [a, b] = questions[Math.floor(Math.random() * questions.length)];
        const msg = await interaction.reply({ embeds: [info('🤔 Would you rather...', `**A)** ${a}\n**B)** ${b}`)], fetchReply: true });
        await msg.react('🅰️');
        await msg.react('🅱️');
    }
};
