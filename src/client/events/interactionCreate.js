import Discord from "discord.js";

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        /*if (!interaction.isCommand()) return;*/

        const permissions = interaction.channel.permissionsFor(interaction.client.user);
        if (!permissions.has('EMBED_LINKS')) return interaction.send(client.messages.noPermsEmbed);

        if(interaction.isCommand()){
            const commandName = interaction.commandName;
            const command = client.commands.get(commandName);
            if (!command) return;
    
            try {
                command.execute(interaction, client, Discord, command);
            } catch (error) {
                interaction.reply(client.messages.runningCommandFailed);
                console.error(error);
            }
        } else if (interaction.isSelectMenu()){

        } else if (interaction.isButton()){
            const commandName = interaction.customId;
            const command = client.commands.get(commandName);
            if (!command) return;
    
            try {
                command.execute(interaction, client, Discord, command);
            } catch (error) {
                interaction.reply(client.messages.runningCommandFailed);
                console.error(error);
            }
        }
    }
}
