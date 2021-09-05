import Discord from "discord.js";

module.exports = {
    name: 'nowplaying',
    description: 'Current Radio Station',
    permission: 'none',
    category: 'radio',
    async execute(interaction, client) {
        let message = {};
        const radio = client.radio.get(interaction.guild.id);
        if (!radio) return interaction.reply({
            content: 'There is nothing playing.',
            ephemeral: true
        });
        if(!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
            return interaction.reply({
                content: client.messageEmojis["error"] + message.errorToGetPlaylist,
                ephemeral: true
            });
        }

        let date = new Date();
        radio.currentTime = date.getTime();
        radio.playTime = parseInt(radio.currentTime)-parseInt(radio.startTime);
        const completed = (radio.playTime);

        message.nowplayingDescription = client.messages.nowplayingDescription.replace("%radio.station.name%", radio.station.name);
        message.nowplayingDescription = message.nowplayingDescription.replace("%radio.station.owner%", radio.station.owner);
        message.nowplayingDescription = message.nowplayingDescription.replace("%client.funcs.msToTime(completed)%", client.funcs.msToTime(completed));

        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.nowplayingTitle)
            .setThumbnail((radio.station.logo || "https://cdn.discordapp.com/emojis/" + client.messageEmojis["play"].replace(/[^0-9]+/g, '')))
            .setColor(client.config.embedColor)
            .setDescription(message.nowplayingDescription)
            .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
            .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};