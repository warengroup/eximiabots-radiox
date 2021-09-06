import Discord from "discord.js";


module.exports = {
    name: 'statistics',
    description: 'Show statistics',
    category: 'info',
    execute(interaction, client) {
        let message = {};
        let stations = client.stations;
        let currentGuild = client.datastore.getEntry(interaction.guild.id);
        let global = client.datastore.getEntry("global");
        let statistics = "";
        
        if(!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
            return interaction.reply({
                content: client.messageEmojis["error"] + message.errorToGetPlaylist,
                ephemeral: true
            });
        }

        if(!currentGuild || currentGuild && !currentGuild.statistics){
            statistics = "You have not listened any radio stations";
        } else {
            Object.keys(stations).forEach(function(station) {
                if(currentGuild.statistics[stations[station].name] && currentGuild.statistics[stations[station].name].time && parseInt(currentGuild.statistics[stations[station].name].time) > 0 && currentGuild.statistics[stations[station].name].used && parseInt(currentGuild.statistics[stations[station].name].used) > 0){
                    statistics += `**${parseInt(station) + 1}. ` + stations[station].name + "** \n";
                    if(global && global.statistics[stations[station].name] && global.statistics[stations[station].name].time && parseInt(global.statistics[stations[station].name].time) > 0 && global.statistics[stations[station].name].used && parseInt(global.statistics[stations[station].name].used) > 0){
                        statistics += "Guild – Time: " + client.funcs.msToTime(currentGuild.statistics[stations[station].name].time) + " (" + ((currentGuild.statistics[stations[station].name].time / global.statistics[stations[station].name].time) * 100).toFixed(0) + "%" + ")" + " / " + "Used: " + currentGuild.statistics[stations[station].name].used + " (" + ((currentGuild.statistics[stations[station].name].used / global.statistics[stations[station].name].used) * 100).toFixed(0) + "%" + ")" + "\n";
                        statistics += "Global – Time: " + client.funcs.msToTime(global.statistics[stations[station].name].time) + " / " + "Used: " + global.statistics[stations[station].name].used + "\n\n";
                    } else {
                        statistics += "Time: " + client.funcs.msToTime(currentGuild.statistics[stations[station].name].time) + " / " + "Used: " + currentGuild.statistics[stations[station].name].used + "\n\n";
                    }
                }
            });
        }
        
        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.statisticsTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["statistics"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(statistics)
            .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
            .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};