import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import RadioClient from "../../Client";

export default {
    name: 'bug',
    description: 'Report a bug',
    category: 'info',
    async execute(interaction: ChatInputCommandInteraction, client: RadioClient) {
        if(!client.user) return interaction.reply({
            content: client.messages.emojis["error"] + client.messages.maintenance,
            ephemeral: true
        });

        const embed = new EmbedBuilder()
            .setTitle(client.messages.replace(client.messages.bugTitle, {
                "%client.user.username%": client.user.username
            }))
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messages.emojis["logo"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(client.messages.replace(client.messages.bugDescription, {
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
