const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { success, error } = require('../../utils/embed');
const db = require('../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket').setDescription('Ticket system')
        .addSubcommand(s => s.setName('setup').setDescription('Set up tickets')
            .addChannelOption(o => o.setName('channel').setDescription('Panel channel').setRequired(true))
            .addChannelOption(o => o.setName('category').setDescription('Ticket category').setRequired(true))
            .addRoleOption(o => o.setName('support').setDescription('Support role').setRequired(true)))
        .addSubcommand(s => s.setName('close').setDescription('Close this ticket'))
        .addSubcommand(s => s.setName('add').setDescription('Add user to ticket')
            .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)))
        .addSubcommand(s => s.setName('remove').setDescription('Remove user from ticket')
            .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        if (sub === 'setup') {
            const ch  = interaction.options.getChannel('channel');
            const cat = interaction.options.getChannel('category');
            const sup = interaction.options.getRole('support');
            await db.set(`ticket_category_${interaction.guild.id}`, cat.id);
            await db.set(`ticket_support_${interaction.guild.id}`, sup.id);
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('open_ticket').setLabel('📩 Open a Ticket').setStyle(ButtonStyle.Primary)
            );
            await ch.send({ embeds: [success('Support', 'Click below to open a ticket.')], components: [row] });
            interaction.reply({ embeds: [success('Done', 'Ticket panel sent.')], ephemeral: true });
        }

        else if (sub === 'close') {
            const isTicket = await db.get(`ticket_${interaction.channel.id}`);
            if (!isTicket) return interaction.reply({ embeds: [error('Error', 'This is not a ticket.')], ephemeral: true });
            await interaction.reply({ embeds: [success('Closing', 'Deleting in 5 seconds...')] });
            await db.delete(`ticket_${interaction.channel.id}`);
            setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        }

        else if (sub === 'add') {
            const user = interaction.options.getMember('user');
            await interaction.channel.permissionOverwrites.edit(user, { ViewChannel: true, SendMessages: true });
            interaction.reply({ embeds: [success('Added', `${user} added to ticket.`)] });
        }

        else if (sub === 'remove') {
            const user = interaction.options.getMember('user');
            await interaction.channel.permissionOverwrites.edit(user, { ViewChannel: false });
            interaction.reply({ embeds: [success('Removed', `${user} removed from ticket.`)] });
        }
    }
};
