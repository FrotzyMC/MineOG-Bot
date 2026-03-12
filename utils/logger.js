const { EmbedBuilder } = require('discord.js');
const db = require('./db');

async function log(guild, type, description) {
    const id = await db.get(`log_channel_${guild.id}`);
    if (!id) return;
    const ch = guild.channels.cache.get(id);
    if (!ch) return;
    const colors = { mod: '#ED4245', member: '#57F287', msg: '#5865F2', role: '#FEE75C' };
    ch.send({ embeds: [new EmbedBuilder().setColor(colors[type] || '#5865F2').setDescription(description).setTimestamp()] }).catch(() => {});
}

module.exports = { log };
