const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs   = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
    ]
});

client.commands = new Collection();
client.snipes   = new Map();

// load all commands from subfolders
const commandFolders = fs.readdirSync('./commands');
const allCommands    = [];

for (const folder of commandFolders) {
    const files = fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith('.js'));
    for (const file of files) {
        const cmd = require(`./commands/${folder}/${file}`);
        client.commands.set(cmd.data.name, cmd);
        allCommands.push(cmd.data.toJSON());
    }
}

// register slash commands on startup
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: allCommands }
    );
    console.log('Slash commands registered.');
});

// handle slash commands
client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) return;
        try { await cmd.execute(interaction); }
        catch (e) { console.error(e); }
    }

    // ticket open button
    if (interaction.isButton() && interaction.customId === 'open_ticket') {
        const { openTicket } = require('./utils/ticketHandler');
        await openTicket(interaction);
    }
});

// snipe - save deleted messages
client.on('messageDelete', msg => {
    if (msg.author?.bot) return;
    client.snipes.set(msg.channel.id, {
        content: msg.content,
        author:  msg.author,
    });
});

// log message edits
client.on('messageUpdate', async (oldMsg, newMsg) => {
    if (!oldMsg.guild || oldMsg.author?.bot) return;
    const { log } = require('./utils/logger');
    log(oldMsg.guild, 'msg',
        `✏️ Message edited by **${oldMsg.author?.tag}** in <#${oldMsg.channel.id}>\n**Before:** ${oldMsg.content || '?'}\n**After:** ${newMsg.content || '?'}`
    );
});

// welcome message
client.on('guildMemberAdd', async member => {
    const db = require('./utils/db');
    const channelId = await db.get(`welcome_${member.guild.id}`);
    if (!channelId) return;
    const ch = member.guild.channels.cache.get(channelId);
    if (ch) ch.send(`👋 Welcome to **${member.guild.name}**, ${member}! You are member #${member.guild.memberCount}.`);
});

client.on('guildMemberRemove', async member => {
    const db = require('./utils/db');
    const channelId = await db.get(`welcome_${member.guild.id}`);
    if (!channelId) return;
    const ch = member.guild.channels.cache.get(channelId);
    if (ch) ch.send(`👋 **${member.user.tag}** has left the server.`);
});

client.login(process.env.TOKEN);
