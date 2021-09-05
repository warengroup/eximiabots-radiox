import Discord from "discord.js";

module.exports = {
    name: 'statistics',
    description: 'Show statistics',
    permission: 'none',
    category: 'info',
    execute(interaction, client) {
        let message = {};
        let stations = client.stations;
        let currentGuild = client.datastore.getEntry(interaction.guild.id);
        let statistics = "";
        
        if(!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
            return interaction.reply(client.messageEmojis["error"] + message.errorToGetPlaylist);
        }

        if(!currentGuild || currentGuild && !currentGuild.statistics){
            statistics = "You have not listened any radio station";
        } else {
            Object.keys(stations).forEach(function(station) {
                if(currentGuild.statistics[stations[station].name] && currentGuild.statistics[stations[station].name].time && parseInt(currentGuild.statistics[stations[station].name].time) > 0 && currentGuild.statistics[stations[station].name].used && parseInt(currentGuild.statistics[stations[station].name].used) > 0){
                    statistics += `**${parseInt(station) + 1}** ` + stations[station].name + " \n";
                    statistics += "Time: " + client.funcs.msToTime(currentGuild.statistics[stations[station].name].time) + "\n";
                    statistics += "Used: " + currentGuild.statistics[stations[station].name].used + "\n";
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