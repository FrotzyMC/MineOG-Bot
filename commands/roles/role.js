const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success, info, error } = require('../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role').setDescription('Role management')
        .addSubcommand(s => s.setName('give').setDescription('Give role')
            .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
            .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
        .addSubcommand(s => s.setName('remove').setDescription('Remove role')
            .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
            .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
        .addSubcommand(s => s.setName('create').setDescription('Create a role')
            .addStringOption(o => o.setName('name').setDescription('Name').setRequired(true))
            .addStringOption(o => o.setName('color').setDescription('Hex color e.g. #FF0000')))
        .addSubcommand(s => s.setName('delete').setDescription('Delete a role')
            .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
        .addSubcommand(s => s.setName('info').setDescription('Role info')
            .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
        .addSubcommand(s => s.setName('list').setDescription('List all roles'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        if (sub === 'give') {
            const m = interaction.options.getMember('user');
            const r = interaction.options.getRole('role');
            await m.roles.add(r);
            return interaction.reply({ embeds: [success('Done', `${r} given to ${m}.`)] });
        }
        if (sub === 'remove') {
            const m = interaction.options.getMember('user');
            const r = interaction.options.getRole('role');
            await m.roles.remove(r);
            return interaction.reply({ embeds: [success('Done', `${r} removed from ${m}.`)] });
        }
        if (sub === 'create') {
            const r = await interaction.guild.roles.create({ name: interaction.options.getString('name'), color: interaction.options.getString('color') ?? '#99AAB5' });
            return interaction.reply({ embeds: [success('Created', `${r} created.`)] });
        }
        if (sub === 'delete') {
            const r = interaction.options.getRole('role');
            await r.delete();
            return interaction.reply({ embeds: [success('Deleted', `**${r.name}** deleted.`)] });
        }
        if (sub === 'info') {
            const r = interaction.options.getRole('role');
            return interaction.reply({ embeds: [info(`Role: ${r.name}`, `**Members:** ${r.members.size}\n**Color:** ${r.hexColor}\n**Position:** ${r.position}\n**Mentionable:** ${r.mentionable}`)] });
        }
        if (sub === 'list') {
            const roles = interaction.guild.roles.cache.filter(r => r.id !== interaction.guild.id).sort((a,b) => b.position - a.position).map(r => r.toString()).join(', ');
            return interaction.reply({ embeds: [info('All Roles', roles || 'None')] });
        }
    }
};
