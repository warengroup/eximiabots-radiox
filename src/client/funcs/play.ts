import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, Guild, OAuth2Guild, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";
import { station } from "../classes/Stations";

export default async function play(client: RadioClient, interaction: ChatInputCommandInteraction | StringSelectMenuInteraction | null, guild: OAuth2Guild | Guild | null, station: station) {
    if(!guild) return;

    const radio = client.radio?.get(guild.id);
    const audioPlayer = client.streamer?.listen(station);
    radio.connection.subscribe(audioPlayer);
    client.funcs.logger('Radio', guild.id + " / " + "Play" + " / " + radio.station.name);

    const embed = new EmbedBuilder()
        .setTitle(client.user?.username || "-")
        .setThumbnail((radio.station.logo || "https://cdn.discordapp.com/emojis/" + client.messages.emojis["play"].replace(/[^0-9]+/g, '')))
        .setColor(client.config.embedColor)
        .addFields({
            name: client.messages.nowplayingTitle,
            value: client.messages.replace(client.messages.nowplayingDescription, {
                "%radio.station.name%": radio.station.name,
                "%radio.station.owner%\n": radio.station.name != radio.station.owner ? radio.station.owner + "\n" : "",
                "%client.funcs.msToTime(completed)%": "",
                "**": "",
                "**:2": ""
            })
        })
        .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
        .setFooter({
            text: client.messages.footerText,
            iconURL: "https://cdn.discordapp.com/emojis/" + client.messages.emojis["eximiabots"].replace(/[^0-9]+/g, '')
        });

    const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('list')
                .setEmoji(client.messages.emojis["list"])
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prev')
                .setEmoji(client.messages.emojis["prev"])
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('stop')
                .setEmoji(client.messages.emojis["stop"])
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('next')
                .setEmoji(client.messages.emojis["next"])
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('statistics')
                .setEmoji(client.messages.emojis["statistics"])
                .setStyle(ButtonStyle.Secondary)
        );

    if(!radio.message){
        radio.message = await radio.textChannel?.send({ embeds: [embed], components: [buttons] });
    } else {
        if(radio.textChannel.id == radio.message.channel.id){
            radio.message.edit({ embeds: [embed], components: [buttons] });
        } else {
            radio.message?.delete();
            radio.message = await radio.textChannel?.send({ embeds: [embed], components: [buttons] });
        }
    }

    interaction?.reply({
        content: client.messages.emojis["play"] + client.messages.replace(client.messages.play, {
            "%radio.station.name%": radio.station.name
        }),
        ephemeral: true
    });

}
