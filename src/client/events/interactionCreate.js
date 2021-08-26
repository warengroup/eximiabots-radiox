module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction, Discord) {
        if (!interaction.isCommand()) return;

        const commandName = interaction.commandName;
        const command = client.commands.get(commandName);
        if (!command) return;
        const permissions = interaction.channel.permissionsFor(interaction.client.user);
        if (!permissions.has('EMBED_LINKS')) return interaction.send(client.messages.noPermsEmbed);

        try {
            command.execute(interaction, client, Discord, command);
        } catch (error) {
            interaction.reply(client.messages.runningCommandFailed);
            console.error(error);
        }
    }
}
