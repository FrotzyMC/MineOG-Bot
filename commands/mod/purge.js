const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge').setDescription('Bulk delete messages')
        .addIntegerOption(o => o.setName('amount').setDescription('How many (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
        .addUserOption(o => o.setName('user').setDescription('Only from this user'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const amount = interaction.options.getInteger('amount');
        const user   = interaction.options.getUser('user');
        let msgs     = [...(await interaction.channel.messages.fetch({ limit: 100 })).values()];
        if (user) msgs = msgs.filter(m => m.author.id === user.id);
        msgs = msgs.slice(0, amount);
        const deleted = await interaction.channel.bulkDelete(msgs, true);
        interaction.editReply({ embeds: [success('Purged', `Deleted **${deleted.size}** messages.`)] });
    }
};
