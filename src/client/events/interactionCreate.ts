import { PermissionFlagsBits } from "discord.js";

export default {
    name: 'interactionCreate',
    async execute(client: any, interaction: any) {

        const permissions = interaction.channel.permissionsFor(interaction.client.user);
        if (!permissions.has(PermissionFlagsBits.ViewChannel)) return;

        if (!permissions.has(PermissionFlagsBits.EmbedLinks)) return interaction.reply({
            content: client.messageEmojis["error"] + client.messages.noPermsEmbed,
            ephemeral: true
        });

        if(interaction.isChatInputCommand()){
            const commandName = interaction.commandName;
            const command = client.commands.get(commandName);
            if (!command) return;

            try {
                command.execute(interaction, client);
            } catch (error) {
                interaction.reply({
                    content: client.messageEmojis["error"] + client.messages.runningCommandFailed,
                    ephemeral: true
                });
                console.error(error);
            }
        } else if (interaction.isStringSelectMenu() || interaction.isButton()){
            const commandName = interaction.customId;
            const command = client.commands.get(commandName);
            if (!command) return;

            try {
                command.execute(interaction, client, command);
            } catch (error) {
                interaction.reply({
                    content: client.messageEmojis["error"] + client.messages.runningCommandFailed,
                    ephemeral: true
                });
                console.error(error);
            }
        }
    }
}
