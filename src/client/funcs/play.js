import Discord from "discord.js";
const {
    createAudioResource
} = require("@discordjs/voice");

module.exports = async function play(client, interaction, guild, station) {
    let message = {};
    const radio = client.radio.get(guild.id);
    const audioPlayer = client.streamer.listen(station);
    radio.connection.subscribe(audioPlayer);
    client.funcs.logger('Radio', guild.id + " / " + "Play" + " / " + radio.station.name);

    message.nowplayingDescription = client.messages.nowplayingDescription.replace("%radio.station.name%", radio.station.name);
    if(radio.station.name != radio.station.owner){
        message.nowplayingDescription = message.nowplayingDescription.replace("%radio.station.owner%", radio.station.owner);
    } else {
        message.nowplayingDescription = message.nowplayingDescription.replace("%radio.station.owner%" + "\n", "");
    }
    message.nowplayingDescription = message.nowplayingDescription.replace("%client.funcs.msToTime(completed)%", "");
    message.nowplayingDescription = message.nowplayingDescription.replace("Owner: ", "");
    message.nowplayingDescription = message.nowplayingDescription.replace("**", "");
    message.nowplayingDescription = message.nowplayingDescription.replace("**", "");

    const embed = new Discord.MessageEmbed()
        .setTitle(client.user.username)
        .setThumbnail((radio.station.logo || "https://cdn.discordapp.com/emojis/" + client.messageEmojis["play"].replace(/[^0-9]+/g, '')))
        .setColor(client.config.embedColor)
        .addField(client.messages.nowplayingTitle, message.nowplayingDescription, true)
        .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
        .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));

    const buttons = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('list')
                .setEmoji(client.messageEmojis["list"])
                .setStyle('SECONDARY')
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('prev')
                .setEmoji(client.messageEmojis["prev"])
                .setStyle('SECONDARY')
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('stop')
                .setEmoji(client.messageEmojis["stop"])
                .setStyle('SECONDARY')
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('next')
                .setEmoji(client.messageEmojis["next"])
                .setStyle('SECONDARY')
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('statistics')
                .setEmoji(client.messageEmojis["statistics"])
                .setStyle('SECONDARY')
        );

    if(!radio.message){
        radio.message = await radio.textChannel.send({ embeds: [embed], components: [buttons] });
    } else {
        if(radio.textChannel.id == radio.message.channel.id){
            radio.message.edit({ embeds: [embed], components: [buttons] });
        } else {
            radio.message?.delete();
            radio.message = await radio.textChannel.send({ embeds: [embed], components: [buttons] });
        }
    }

    message.play = client.messages.play.replace("%radio.station.name%", radio.station.name);

    interaction?.reply({
        content: client.messageEmojis["play"] + message.play,
        ephemeral: true
    });

}
