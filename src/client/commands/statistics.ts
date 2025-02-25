import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";


export default {
    name: 'statistics',
    description: 'Show statistics',
    category: 'info',
    execute(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, client: RadioClient) {

        if(!interaction.guild) return interaction.reply({
            content: client.messages.emojis["error"] + client.messages.maintenance,
            flags: 'Ephemeral'
        });

        let currentGuild = client.datastore?.getEntry(interaction.guild.id);
        let global = client.datastore?.getEntry("global");
        let statistics = "";

        if(!client.stations) {
            return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.replace(client.messages.errorToGetPlaylist, {
                    "%client.config.supportGuild%": client.config.supportGuild
                }),
                flags: 'Ephemeral'
            });
        }

        if(!currentGuild || currentGuild && !currentGuild.statistics){
            statistics = "You have not listened any radio stations";
        } else {
            statistics = "[Open Dashboard](https://eximiabots.waren.io/radiox/" + interaction.guild.id + "/stats?info=" + Buffer.from(JSON.stringify(currentGuild), 'utf8').toString('base64') + "&globalInfo=" + Buffer.from(JSON.stringify(global), 'utf8').toString('base64') + ")" + "\n";
        }

        const embed = new EmbedBuilder()
            .setTitle(client.messages.statisticsTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messages.emojis["statistics"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(statistics)
            .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
            .setFooter({
                text: client.messages.footerText,
                iconURL: "https://cdn.discordapp.com/emojis/" + client.messages.emojis["eximiabots"].replace(/[^0-9]+/g, '')
            });

        interaction.reply({
            embeds: [embed],
            flags: 'Ephemeral'
        });
    }
};
