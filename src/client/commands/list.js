import Discord from "discord.js";

module.exports = {
    name: 'list',
    description: 'List radio stations',
    category: 'radio',
    execute(interaction, client) {
        let message = {};
        if(!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
            return interaction.reply({
                content: client.messageEmojis["error"] + message.errorToGetPlaylist,
                ephemeral: true
            });
        }

        const radio = client.radio.get(interaction.guild.id);

        if(radio){
            client.funcs.listStations(client, interaction);
        } else {
            let stations = `${client.stations.map(s => `**#** ${s.name}`).join('\n')}`
            const hashs = stations.split('**#**').length;
            for (let i = 0; i < hashs; i++) {
                stations = stations.replace('**#**', `**${i + 1}.**`);
            }

            let embed = new Discord.MessageEmbed()
                .setTitle(client.messages.listTitle)
                .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["list"].replace(/[^0-9]+/g, ''))
                .setColor(client.config.embedColor)
                .setDescription(stations)
                .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
                .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};
