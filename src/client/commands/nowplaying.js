import { EmbedBuilder } from "discord.js";

module.exports = {
    name: 'nowplaying',
    description: 'Current Radio Station',
    category: 'radio',
    async execute(interaction, client, command) {
        if (client.funcs.check(client, interaction, command)) {
            let message = {};
            const radio = client.radio.get(interaction.guild.id);

            let date = new Date();
            radio.currentTime = date.getTime();
            radio.playTime = parseInt(radio.currentTime)-parseInt(radio.startTime);
            const completed = (radio.playTime);

            message.nowplayingDescription = client.messages.nowplayingDescription.replace("%radio.station.name%", radio.station.name);
            message.nowplayingDescription = message.nowplayingDescription.replace("%radio.station.owner%" + "\n", radio.station.name != radio.station.owner ? radio.station.owner + "\n" : "");
            message.nowplayingDescription = message.nowplayingDescription.replace("%client.funcs.msToTime(completed)%", client.funcs.msToTime(completed));

            const embed = new EmbedBuilder()
                .setTitle(client.messages.nowplayingTitle)
                .setThumbnail((radio.station.logo || "https://cdn.discordapp.com/emojis/" + client.messageEmojis["play"].replace(/[^0-9]+/g, '')))
                .setColor(client.config.embedColor)
                .setDescription(message.nowplayingDescription)
                .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
                .setFooter({
                    text: client.messages.footerText,
                    iconURL: "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, '')
                });

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};
