const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('ship').setDescription('Ship two users')
        .addUserOption(o => o.setName('user1').setDescription('First user').setRequired(true))
        .addUserOption(o => o.setName('user2').setDescription('Second user').setRequired(true)),
    async execute(interaction) {
        const u1  = interaction.options.getUser('user1');
        const u2  = interaction.options.getUser('user2');
        const pct = Math.floor(Math.random() * 101);
        const bar = '█'.repeat(Math.floor(pct/10)) + '░'.repeat(10 - Math.floor(pct/10));
        interaction.reply({ embeds: [info('💘 Ship', `**${u1.username}** x **${u2.username}**\n\n${bar} **${pct}%**`)] });
    }
};
