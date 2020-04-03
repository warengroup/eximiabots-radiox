module.exports = {
    name: 'statistics',
    alias: 'stats',
    usage: '',
    description: 'Show usage statistics.',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, command) {
        let stations = client.stations;
        let currentGuild = client.datastore.getEntry(msg.guild.id);
        let statistics;
        let i = 0;
        
        if(!currentGuild || currentGuild && !currentGuild.statistics){
            statistics = "You have not listened any radio station";
        } else {
            Object.keys(client.stations).forEach(function(station) {
                if(currentGuild.statistics[stations[station].name]){
                    if(i > 0){
                        statistics += `**${parseInt(station) + 1}** ` + stations[station].name + " \n";
                        statistics += "Time: " + client.funcs.msToTime(currentGuild.statistics[stations[station].name].time, "hh:mm:ss") + "\n";
                        statistics += "Used: " + currentGuild.statistics[stations[station].name].used + "\n";
                    } else {
                        statistics = `**${parseInt(station) + 1}** ` + stations[station].name + " \n";
                        statistics += "Time: " + client.funcs.msToTime(currentGuild.statistics[stations[station].name].time, "hh:mm:ss") + "\n";
                        statistics += "Used: " + currentGuild.statistics[stations[station].name].used + "\n";
                    }

                    i++;
                }
            });
        }
        
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.statisticsTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["statistics"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(statistics)
            .setFooter('EximiaBots by Warén Media', "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        return msg.channel.send(embed);
    }
};