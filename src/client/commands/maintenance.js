import Discord from "discord.js";
const _importDynamic = new Function('modulePath', 'return import(modulePath)');
const fetch = (...args) => _importDynamic('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    name: 'maintenance',
    description: 'Bot Maintenance',
    category: 'info',
    options: [
        { type: "NUMBER", name: "action", description: "Select action", required: false}
    ],
    async execute(interaction, client) {
        let message = {};

        if(!client.funcs.isDev(client.config.devId, interaction.user.id)) return interaction.reply({
            content: client.messageEmojis["error"] + client.messages.notAllowed,
            ephemeral: true
        });
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
                emoji: "<:RadioXList:688541155519889482>",
                label: "Reload Stations",
                description: "",
                value: "7"
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
            return interaction.reply({
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
                client.config.maintenance = true;
                process.emit('SIGINT');
                break;
            case "4":
                client.config.maintenance = true;
                client.user.setStatus('idle');
                client.funcs.saveRadios(client);
                client.user.setStatus('online');
                client.config.maintenance = false;
                break;
            case "5":
                client.config.maintenance = true;
                client.user.setStatus('idle');
                let guilds = await client.guilds.fetch();
                client.funcs.restoreRadios(client, guilds);
                client.user.setStatus('online');
                client.config.maintenance = false;
                break;
            case "6":
                client.config.maintenance = true;
                client.user.setStatus('idle');
                require(`../commands.js`).execute(client);
                client.user.setStatus('online');
                client.config.maintenance = false;
                break;
            case "7":
                try {
                    client.funcs.logger('Stations', 'Started fetching list – ' + client.config.stationslistUrl);
                    client.stations = await fetch(client.config.stationslistUrl)
                        .then(client.funcs.checkFetchStatus)
                        .then(response => response.json());

                    client.funcs.logger('Stations', 'Successfully fetched list');

                    client.streamer.refresh(client);

                } catch (error) {
                    client.funcs.logger('Stations', 'Fetching list failed');
                }
                break;
            case "8":
                client.user.setStatus('dnd');
                client.funcs.logger("Maintenance Mode", "Enabled");
                client.config.maintenance = true;
                break;
            case "9":
                client.user.setStatus('online');
                client.funcs.logger("Maintenance Mode", "Disabled");
                client.config.maintenance = false;
                break;
            default:

        }

    }
};
