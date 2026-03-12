const { EmbedBuilder } = require('discord.js');

function makeEmbed(color, title, desc) {
    return new EmbedBuilder().setColor(color).setTitle(title).setDescription(desc).setTimestamp();
}

module.exports = {
    success: (t, d) => makeEmbed('#57F287', `✅ ${t}`, d),
    error:   (t, d) => makeEmbed('#ED4245', `❌ ${t}`, d),
    info:    (t, d) => makeEmbed('#5865F2', `ℹ️ ${t}`, d),
    warn:    (t, d) => makeEmbed('#FEE75C', `⚠️ ${t}`, d),
};
