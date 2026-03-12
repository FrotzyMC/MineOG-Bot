const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { success } = require('./embed');
const db = require('./db');

async function openTicket(interaction) {
    const guild      = interaction.guild;
    const user       = interaction.user;
    const categoryId = await db.get(`ticket_category_${guild.id}`);
    const supportId  = await db.get(`ticket_support_${guild.id}`);

    // don't let them open two tickets
    const existing = guild.channels.cache.find(c => c.name === `ticket-${user.username.toLowerCase()}`);
    if (existing) {
        return interaction.reply({ content: `You already have a ticket open: ${existing}`, ephemeral: true });
    }

    const channel = await guild.channels.create({
        name: `ticket-${user.username}`,
        type: ChannelType.GuildText,
        parent: categoryId ?? null,
        permissionOverwrites: [
            { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: user.id,  allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            ...(supportId ? [{ id: supportId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }] : []),
        ],
    });

    await db.set(`ticket_${channel.id}`, user.id);

    channel.send({
        content: `<@${user.id}> ${supportId ? `<@&${supportId}>` : ''}`,
        embeds: [success('Ticket Opened', `Welcome ${user}! Support will be with you shortly.\nUse \`/ticket close\` to close this ticket.`)]
    });

    interaction.reply({ content: `Your ticket has been opened: ${channel}`, ephemeral: true });
}

module.exports = { openTicket };
