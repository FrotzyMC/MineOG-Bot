const { SlashCommandBuilder } = require('discord.js');
const { success, error } = require('../../utils/embed');

const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
const parse = s => { const m = s.match(/^(\d+)([smhd])$/); return m ? +m[1] * units[m[2]] : null; };

module.exports = {
    data: new SlashCommandBuilder().setName('remind').setDescription('Set a reminder')
        .addStringOption(o => o.setName('time').setDescription('e.g. 10m 2h').setRequired(true))
        .addStringOption(o => o.setName('message').setDescription('What to remind you').setRequired(true)),
    async execute(interaction) {
        const t = interaction.options.getString('time');
        const m = interaction.options.getString('message');
        const ms = parse(t);
        if (!ms) return interaction.reply({ embeds: [error('Error', 'Use e.g. 10m, 2h, 1d')], ephemeral: true });
        interaction.reply({ embeds: [success('Reminder Set', `I'll remind you in **${t}**: ${m}`)] });
        setTimeout(() => {
            interaction.user.send({ embeds: [success('⏰ Reminder', m)] })
                .catch(() => interaction.channel.send({ content: `<@${interaction.user.id}>`, embeds: [success('⏰ Reminder', m)] }));
        }, ms);
    }
};
