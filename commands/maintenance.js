module.exports = {
    name: 'maintenance',
    alias: 'm',
    usage: '',
    description: 'Bot Maintenance',
    permission: 'none',
    category: 'maintenance',
    execute(msg, args, client, Discord, command) {
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.maintenanceTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["maintenance"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(client.messages.maintenanceDescription)
            .setFooter('EximiaBots by Warén Media', "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
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