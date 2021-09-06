import Discord from "discord.js";

module.exports = {
    name: 'maintenance',
    description: 'Bot Maintenance',
    permission: 'none',
    category: 'info',
    options: [
        { type: "NUMBER", name: "action", description: "Select action", required: false}
    ],
    async execute(interaction, client) {
        let message = {};

        if(!client.funcs.isDev(client.config.devId, interaction.user.id)) return interaction.reply(client.messageEmojis["error"] + client.messages.notAllowed);
        let action = interaction.options?.getNumber("action") ?? interaction.values?.[0];
        const options = new Array(
            {
                emoji: "🌀",
                label: "Restart Bot",
                description: "",
                value: "0"
            },
            {
                emoji: "<:RadioXStop:688541155377414168>",
                label: "Save Radios",
                description: "",
                value: "4"
            },
            {
                emoji: "<:RadioXPlay:688541155712827458>",
                label: "Restore Radios",
                description: "",
                value: "5"
            },
            {
                emoji: "#️⃣",
                label: "Reload Commands",
                description: "",
                value: "6"
            },
            {
                emoji: "<:dnd:746069698139127831>",
                label: "Enable Maintenance Mode",
                description: "",
                value: "8"
            },
            {
                emoji: "<:online:746069731836035098>",
                label: "Disable Maintenance Mode",
                description: "",
                value: "9"
            }
        );
        
        const menu = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId('maintenance')
                .setPlaceholder('Select action')
                .addOptions(options)
        );

        if(!action){
            interaction.reply({
                content: "**" + client.messages.maintenanceTitle + "**",
                components: [menu],
                ephemeral: true
            });
        }

        client.funcs.logger('Maintenance', options.find(option => option.value == action).label);

        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.maintenanceTitle)
            .setColor(client.config.embedColor)
            .setDescription(options.find(option => option.value == action).label)
            .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

        switch(action){
            case "0":
                process.emit('SIGINT');
                break;
            case "4":
                client.user.setStatus('idle');
                setTimeout(function () {
                    client.funcs.saveRadios(client);
                }, 5000);
                client.user.setStatus('online');
                break;
            case "5":
                client.user.setStatus('idle');
                let guilds = await client.guilds.fetch();
                setTimeout(function () {
                    client.funcs.restoreRadios(client, guilds);
                }, 5000);
                client.user.setStatus('online');
                break;
            case "6":
                client.user.setStatus('idle');
                require(`../commands.js`).execute(client);
                client.user.setStatus('online');
                break;
            case "8":
                client.user.setStatus('dnd');
                break;
            case "9":
                client.user.setStatus('online');
                break;
            default:

        }

        
        /*
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
        });*/

    }
};