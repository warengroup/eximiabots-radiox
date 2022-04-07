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
            statistics = "[Open Dashboard](https://eximiabots.waren.io/radiox/" + interaction.guild.id + "/stats?info=" + Buffer.from(JSON.stringify(currentGuild), 'utf8').toString('base64') + "&globalInfo=" + Buffer.from(JSON.stringify(global), 'utf8').toString('base64') + ")" + "\n";
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.statisticsTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["statistics"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(statistics)
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
};
