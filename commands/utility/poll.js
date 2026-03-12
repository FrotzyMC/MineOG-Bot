const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('poll').setDescription('Create a poll')
        .addStringOption(o => o.setName('question').setDescription('Question').setRequired(true))
        .addStringOption(o => o.setName('option1').setDescription('Option 1').setRequired(true))
        .addStringOption(o => o.setName('option2').setDescription('Option 2').setRequired(true))
        .addStringOption(o => o.setName('option3').setDescription('Option 3'))
        .addStringOption(o => o.setName('option4').setDescription('Option 4')),
    async execute(interaction) {
        const q    = interaction.options.getString('question');
        const emjs = ['1️⃣','2️⃣','3️⃣','4️⃣'];
        const opts = [1,2,3,4].map(n => interaction.options.getString(`option${n}`)).filter(Boolean);
        const msg  = await interaction.reply({ embeds: [info(`📊 ${q}`, opts.map((o,i) => `${emjs[i]} ${o}`).join('\n'))], fetchReply: true });
        for (let i = 0; i < opts.length; i++) await msg.react(emjs[i]);
    }
};
