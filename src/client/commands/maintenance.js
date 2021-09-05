import Discord from "discord.js";

module.exports = {
    name: 'maintenance',
    description: 'Bot Maintenance',
    permission: 'none',
    category: 'info',
    execute(interaction, client) {
        let message = {};

        if(!client.funcs.isDev(client.config.devId, interaction.user.id)) return interaction.reply(client.messageEmojis["error"] + client.messages.notAllowed);

        if(client.config.version.includes("-dev")){
            interaction.reply({
                content: "Maintenance Initiated",
                ephemeral: true
            });

            process.emit('SIGINT');
        } else {
            if(!client.stations) {
                message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
                return interaction.reply(client.messageEmojis["error"] + message.errorToGetPlaylist);
            }
            
            let currentRadios = client.radio.keys();
            let radio = currentRadios.next();
            let stoppedRadios = "";
    
            client.user.setStatus('dnd');
            
            while (!radio.done) {
                let currentRadio = client.radio.get(radio.value);
                currentRadio.guild = client.datastore.getEntry(radio.value).guild;
    
                if(currentRadio){
                    client.funcs.statisticsUpdate(client, currentRadio.guild, currentRadio);
                    currentRadio.connection?.destroy();
                    currentRadio.audioPlayer?.stop();
                    currentRadio.message?.delete();
                    client.radio.delete(radio.value);
                    stoppedRadios += "-" + radio.value + ": " + currentRadio.guild.name + "\n";
                }
                radio = currentRadios.next();
            }
    
            const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.maintenanceTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["maintenance"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription("Stopped all radios" + "\n" + stoppedRadios)
            .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
            .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
    
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

    }
};