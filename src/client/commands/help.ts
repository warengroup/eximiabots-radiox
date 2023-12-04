import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import RadioClient from "../../Client";
import { command } from "../commands";

export default {
    name: 'help',
    description: 'Get help using bot',
    category: 'info',
    execute(interaction: ChatInputCommandInteraction, client: RadioClient) {

        if(!client.user) return interaction.reply({
            content: client.messages.emojis["error"] + client.messages.maintenance,
            ephemeral: true
        });

        const embed = new EmbedBuilder()
            .setTitle(client.messages.replace(client.messages.helpTitle, {
                "%client.user.username%": client.user.username
            }))
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messages.emojis["logo"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(client.messages.replace(client.messages.helpDescription, {
                    "%client.config.supportGuild%": client.config.supportGuild
            }))
            .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
            .setFooter({
                text: client.messages.footerText,
                iconURL: "https://cdn.discordapp.com/emojis/" + client.messages.emojis["eximiabots"].replace(/[^0-9]+/g, '')
            });

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
