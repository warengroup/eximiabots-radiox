import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";
import { command } from "../commands";

export default {
    name: 'nowplaying',
    description: 'Current Radio Station',
    category: 'radio',
    async execute(interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, client: RadioClient, command: command) {
        if(client.funcs.check(client, interaction, command)) {

            const radio = client.radio?.get(interaction.guild?.id);

            let date = new Date();
            radio.currentTime = date.getTime();
            radio.playTime = parseInt(radio.currentTime)-parseInt(radio.startTime);
            const completed = (radio.playTime);

            if(radio.station?.playlist?.type == "supla" || radio.station?.playlist?.type == "yle"){
                let playlist: any = await fetch(radio.station.playlist.address)
                    .then((response: Response) => response.json())
                    .catch(error => {
                    });

                switch(radio.station?.playlist.type){
                    case "supla":
                        radio.station.track = "__" + playlist.items[0].artist + "__" + "\n" + playlist.items[0].song;
                        break;
                    case "yle":
                        radio.station.track = "-";
                        break;
                    default:
                        radio.station.track = "-";
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(client.messages.nowplayingTitle)
                .setThumbnail((radio.station.logo || "https://cdn.discordapp.com/emojis/" + client.messages.emojis["play"].replace(/[^0-9]+/g, '')))
                .setColor(client.config.embedColor)
                .setDescription(client.messages.replace(client.messages.nowplayingDescription, {
                    "%radio.station.name%": radio.station.name,
                    "%radio.station.owner%\n": radio.station.name != radio.station.owner ? radio.station.owner + "\n" : "",
                    "%client.funcs.msToTime(completed)%": client.funcs.msToTime(completed),
                    "\n\n%radio.station.track%": radio.station.track != "-" ? "\n\n" + radio.station.track : ""
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
    }
};
