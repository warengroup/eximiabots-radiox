module.exports = {
    name: 'statistics',
    alias: 'stats',
    usage: '',
    description: 'Show usage statistics.',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, command) {
        let stations = client.stations;
        let currentGuildStatistics = client.datastore.getEntry(msg.guild.id).statistics;
        let statistics;
        let i = 0;
        
        Object.keys(client.stations).forEach(function(station) {
            if(currentGuildStatistics[stations[station].name]){
                if(i > 0){
                    statistics += "**" + station + " " + stations[station].name + "** \n";
                    statistics += "Time: " + msToTime(currentGuildStatistics[stations[station].name].time, "hh:mm:ss") + "\n";
                    statistics += "Used: " + currentGuildStatistics[stations[station].name].used + "\n";
                } else {
                    statistics = "**" + station + " " + stations[station].name + "** \n";
                    statistics += "Time: " + msToTime(currentGuildStatistics[stations[station].name].time, "hh:mm:ss") + "\n";
                    statistics += "Used: " + currentGuildStatistics[stations[station].name].used + "\n";
                }
                i++;
            }
        });
        
        if(!statistics){
            statistics = "You have not listened any radio station";
        }
        
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.statisticsTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["list"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(statistics)
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