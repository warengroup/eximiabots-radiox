import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, Guild, OAuth2Guild, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";
import { station } from "../classes/Stations";

export default async function play(client: RadioClient, interaction: ChatInputCommandInteraction | StringSelectMenuInteraction | null, guild: OAuth2Guild | Guild | null, station: station) {
    if(!guild) return;

    const radio = client.radio?.get(guild.id);
    const audioPlayer = client.streamer?.listen(station);
    radio.connection.subscribe(audioPlayer);
    client.funcs.logger('Radio', guild.id + " / " + "Play" + " / " + radio.station.name);

    if(radio.station?.playlist?.type == "supla" || radio.station?.playlist?.type == "yle"){
        let playlist: any = await fetch(radio.station.playlist.address)
            .then((response: Response) => response.json())
            .catch(error => {
            });

        try {
            switch(radio.station?.playlist.type){
                case "supla":
                    radio.station.track = "__" + playlist.items[0]?.artist + "__" + "\n" + playlist.items[0]?.song;
                    break;
                case "yle":
                    radio.station.track = "-";
                    break;
                default:
                    radio.station.track = "-";
            }
        } catch(TypeError) {

        }
    }

    const embed = new EmbedBuilder()
        .setTitle(client.user?.username || "-")
        .setThumbnail((radio.station.logo || "https://cdn.discordapp.com/emojis/" + client.messages.emojis["play"].replace(/[^0-9]+/g, '')))
        .setColor(client.config.embedColor)
        .addFields({
            name: client.messages.playTitle1,
            value: client.messages.replace(client.messages.playDescription1, {
                "%radio.station.name%": radio.station.name,
                "%radio.station.owner%": radio.station.name != radio.station.owner ? radio.station.owner + "\n" : ""
            })
        },
        {
            name: client.messages.playTitle2,
            value: client.messages.replace(client.messages.playDescription2, {
                "%radio.station.track%": radio.station.track != undefined ? "\n\n" + radio.station.track : "-"
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

    setInterval(async function(){
        let changed = false;

        if(radio.station?.playlist?.type == "supla" || radio.station?.playlist?.type == "yle"){
            let playlist: any = await fetch(radio.station.playlist.address)
                .then((response: Response) => response.json())
                .catch(error => {
                });
            try {
                switch(radio.station?.playlist.type){
                    case "supla":
                        if(radio.station.track != playlist.items[0].artist + "\n" + playlist.items[0].song){
                            changed = true;
                            radio.station.track = "__" + playlist.items[0].artist + "__" + "\n" + playlist.items[0].song;
                        }
                        break;
                    case "yle":
                        radio.station.track = "-";
                        break;
                    default:
                        radio.station.track = "-";
                }
            } catch(TypeError) {

            }
        }

        if(changed == true){
            const embed = new EmbedBuilder()
            .setTitle(client.user?.username || "-")
            .setThumbnail((radio.station.logo || "https://cdn.discordapp.com/emojis/" + client.messages.emojis["play"].replace(/[^0-9]+/g, '')))
            .setColor(client.config.embedColor)
            .addFields({
                name: client.messages.playTitle1,
                value: client.messages.replace(client.messages.playDescription1, {
                    "%radio.station.name%": radio.station.name,
                    "%radio.station.owner%": radio.station.name != radio.station.owner ? radio.station.owner + "\n" : ""
                })
            },
            {
                name: client.messages.playTitle2,
                value: client.messages.replace(client.messages.playDescription2, {
                    "%radio.station.track%": radio.station.track != undefined ? "\n\n" + radio.station.track : "-"
                })
            })
            .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
            .setFooter({
                text: client.messages.footerText,
                iconURL: "https://cdn.discordapp.com/emojis/" + client.messages.emojis["eximiabots"].replace(/[^0-9]+/g, '')
            });


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
        }
    },15000);

    interaction?.reply({
        content: client.messages.emojis["play"] + client.messages.replace(client.messages.play, {
            "%radio.station.name%": radio.station.name
        }),
        ephemeral: true
    });

}
