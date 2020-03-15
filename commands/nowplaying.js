module.exports = {
    name: 'nowplaying',
    alias: 'np',
    usage: '',
    description: 'See the currently playing song position and length.',
    permission: 'none',
    category: 'music',
    async execute(msg, args, client, Discord, prefix) {
        let message = {};
        const radio = client.radio.get(msg.guild.id);
        if (!radio || !radio.playing) return msg.channel.send('There is nothing playing.');
        radio.time = radio.connection.dispatcher.streamTime;
        const completed = (radio.time.toFixed(0));

        message.nowplayingDescription = client.messages.nowplayingDescription.replace("%radio.station.name%", radio.station.name);
        message.nowplayingDescription = message.nowplayingDescription.replace("%radio.station.owner%", radio.station.owner);
        message.nowplayingDescription = message.nowplayingDescription.replace("%msToTime(completed, \"hh:mm:ss\")%", msToTime(completed, "hh:mm:ss"));
        
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.nowplayingTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["play"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(message.nowplayingDescription)
            .setFooter('EximiaBots by Warén Media', 'https://cdn.discordapp.com/emojis/687022937978568760.png');
        return msg.channel.send(embed);
    }
};
function msToTime(duration, format) {
    var seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 24);

    days = (days < 10) ? "0" + days : days;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if (format === "hh:mm:ss") {
        return `${hours}:${minutes}:${seconds}`;
    } else if (format === "dd:hh:mm:ss") {
        return `${days}:${hours}:${minutes}:${seconds}`;
    }
}