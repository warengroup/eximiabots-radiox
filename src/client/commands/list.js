module.exports = {
    name: 'list',
    description: 'List radio stations',
    permission: 'none',
    category: 'radio',
    execute(interaction, client, Discord, command) {
        let message = {};
        if(!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
            return interaction.reply(client.messageEmojis["error"] + message.errorToGetPlaylist);
        }
        
        const radio = client.radio.get(interaction.guild.id);
        
        if(radio){
            let menu = [];

            let stations = new Array();

            let options = new Array();
            options[1] = new Array();
            options[2] = new Array();

            stations[1] = client.stations.slice(0,24).forEach(station => {
                station = {
                    label: station.name,
                    description: station.owner,
                    value: station.name
                };
                options[1].push(station);
            });

            stations[2] = client.stations.slice(25).forEach(station => {
                station = {
                    label: station.name,
                    description: station.owner,
                    value: station.name
                };
                options[2].push(station);
            });

            menu = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('play')
                        .setPlaceholder('Change station')
                        .addOptions(options[1])
                        .addOptions(options[2])
                );

            stations = null;
            options = null;

            interaction.reply({
                content: '**Select station:**',
                components: [menu],
                ephemeral: true
            });
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