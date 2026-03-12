const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../../utils/embed');

const answers = ['Yes.','No.','Definitely.','Absolutely not.','Ask again later.','Without a doubt.','Very doubtful.','It is certain.','My sources say no.','Outlook not so good.'];

module.exports = {
    data: new SlashCommandBuilder().setName('8ball').setDescription('Ask the magic 8ball')
        .addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true)),
    async execute(interaction) {
        const q = interaction.options.getString('question');
        const a = answers[Math.floor(Math.random() * answers.length)];
        interaction.reply({ embeds: [info('🎱 8Ball', `**${q}**\n\n${a}`)] });
    }
};
