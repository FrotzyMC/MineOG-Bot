const { SlashCommandBuilder } = require('discord.js');
const { info, error } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('snipe').setDescription('Show last deleted message'),
    async execute(interaction) {
        const msg = interaction.client.snipes?.get(interaction.channel.id);
        if (!msg) return interaction.reply({ embeds: [error('Nothing', 'No deleted messages cached.')], ephemeral: true });
        interaction.reply({ embeds: [info(`Sniped from ${msg.author.tag}`, msg.content || '*[no text]*').setThumbnail(msg.author.displayAvatarURL())] });
    }
};
