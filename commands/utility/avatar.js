const { SlashCommandBuilder } = require('discord.js');
const { info } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder().setName('avatar').setDescription("Get a user's avatar")
        .addUserOption(o => o.setName('user').setDescription('User')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') ?? interaction.user;
        const url  = user.displayAvatarURL({ dynamic: true, size: 1024 });
        interaction.reply({ embeds: [info(`${user.tag}'s Avatar`, `[Download](${url})`).setImage(url)] });
    }
};
