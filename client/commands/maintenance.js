module.exports = {
    name: 'maintenance',
    alias: 'm',
    usage: '',
    description: 'Bot Maintenance',
    permission: 'none',
    category: 'info',
    execute(msg, args, client, Discord, command) {
        let message = {};

        if(!client.funcs.isDev(client.config.devId, msg.author.id)) return msg.channel.send(client.messageEmojis["error"] + client.messages.notAllowed);

        if(!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
            return msg.channel.send(client.messageEmojis["error"] + message.errorToGetPlaylist);
        }
        
        let currentRadios = client.radio.keys();
        let radio = currentRadios.next();
        let stoppedRadios = "";

        client.user.setStatus('dnd');
        
        while (!radio.done) {
            let currentRadio = client.radio.get(radio.value);
            currentRadio.guild = client.datastore.getEntry(radio.value).guild;

            if(currentRadio){
                client.funcs.statisticsUpdate(client, currentRadio.currentGuild.guild, currentRadio);
                currentRadio.connection.dispatcher?.destroy();
                currentRadio.voiceChannel.leave();
                const cembed = new Discord.MessageEmbed()
                    .setTitle(client.messages.maintenanceTitle)
                    .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["maintenance"].replace(/[^0-9]+/g, ''))
                    .setColor(client.config.embedColor)
                    .setDescription(client.messages.sendedMaintenanceMessage)
                    .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
                currentRadio.textChannel.send(cembed);
                client.radio.delete(radio.value);
                stoppedRadios += "-" + radio.value + ": " + currentRadio.currentGuild.guild.name + "\n";
            }
            radio = currentRadios.next();
        }

        const embed = new Discord.MessageEmbed()
        .setTitle(client.messages.maintenanceTitle)
        .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["maintenance"].replace(/[^0-9]+/g, ''))
        .setColor(client.config.embedColor)
        .setDescription("Stopped all radios" + "\n" + stoppedRadios)
        .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        return msg.channel.send(embed);
    }
};