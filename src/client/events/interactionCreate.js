module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {

        const permissions = interaction.channel.permissionsFor(interaction.client.user);
        if (!permissions.has('EMBED_LINKS')) return interaction.send(client.messages.noPermsEmbed);

        if(interaction.isCommand()){
            const commandName = interaction.commandName;
            const command = client.commands.get(commandName);
            if (!command) return;
    
            try {
                command.execute(interaction, client);
            } catch (error) {
                interaction.reply({
                    content: client.messages.runningCommandFailed,
                    ephemeral: true
                });
                console.error(error);
            }
        } else if (interaction.isSelectMenu() || interaction.isButton()){
            const commandName = interaction.customId;
            const command = client.commands.get(commandName);
            if (!command) return;

            try {
                command.execute(interaction, client, command);
            } catch (error) {
                interaction.reply({
                    content: client.messages.runningCommandFailed,
                    ephemeral: true
                });
                console.error(error);
            }
        }
    }
}
