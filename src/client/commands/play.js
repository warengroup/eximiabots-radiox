const {
    createAudioPlayer,
    getVoiceConnection,
    joinVoiceChannel
} = require("@discordjs/voice");

module.exports = {
    name: "play",
    usage: "<song name>",
    description: "Play radio",
    options: [
        { type: "STRING", name: "query", description: "Select station", required: false}
    ],
    permission: "none",
    category: "radio",
    async execute(interaction, client, Discord, command) {
        let message = {};
        let query = interaction.options?.getString("query") ?? interaction.values?.[0];
        if(!query){
            if(!client.stations) {
                message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
                return interaction.reply(client.messageEmojis["error"] + message.errorToGetPlaylist);
            }

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

            const menu = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('play')
                        .setPlaceholder('Nothing selected')
                        .addOptions(options[1])
                        .addOptions(options[2])
                );

            stations = null;
            options = null;

		    return interaction.reply({
                content: '**Select station:**',
                components: [menu],
                ephemeral: true
            });
        }
        let url = query ? query.replace(/<(.+)>/g, "$1") : "";
        const radio = client.radio.get(interaction.guild.id);
        const voiceChannel = interaction.member.voice.channel;
        if (!radio) {
            if (!interaction.member.voice.channel)
                return interaction.reply({
                    content: client.messageEmojis["error"] + client.messages.noVoiceChannel,
                    ephemeral: true
                });
        } else {
            if (voiceChannel !== radio.voiceChannel)
                return interaction.reply({
                    content: client.messageEmojis["error"] + client.messages.wrongVoiceChannel,
                    ephemeral: true
                });
        }
        if (!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace(
                "%client.config.supportGuild%",
                client.config.supportGuild
            );
            return interaction.reply({
                content: client.messageEmojis["error"] + message.errorToGetPlaylist,
                ephemeral: true
            });
        }
        if (!query) return interaction.reply(client.messages.noQuery);
        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has("CONNECT")) {
            return interaction.reply(client.messageEmojis["error"] + client.messages.noPermsConnect);
        }
        if (!permissions.has("SPEAK")) {
            return interaction.reply(client.messageEmojis["error"] + client.messages.noPermsSpeak);
        }
        let station;
        const number = parseInt(query - 1);
        if (url.startsWith("http")) {
            return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.errorStationURL,
                ephemeral: true
            });
        } else if (!isNaN(number)) {
            if (number > client.stations.length - 1) {
                return interaction.reply({
                    content: client.messageEmojis["error"] + client.messages.wrongStationNumber,
                    ephemeral: true
                });
            } else {
                url = client.stations[number].stream[client.stations[number].stream.default];
                station = client.stations[number];
            }
        } else {
            if (query.length < 3)
                return interaction.reply({
                    content: client.messageEmojis["error"] + client.messages.tooShortSearch,
                    ephemeral: true
                });
            const sstation = await client.funcs.searchStation(query, client);
            if (!sstation)
                return interaction.reply({
                    content: client.messageEmojis["error"] + client.messages.noSearchResults,
                    ephemeral: true
                });
            url = sstation.stream[sstation.stream.default];
            station = sstation;
        }

        if (radio) {
            client.funcs.statisticsUpdate(client, interaction.guild, radio);
            radio.audioPlayer.stop();
            
            let date = new Date();
            radio.station = station;
            radio.textChannel = interaction.channel;
            radio.startTime = date.getTime();
            client.funcs.play(interaction, interaction.guild, client, url, Discord);

            return;
        }

        const construct = {
            textChannel: interaction.channel,
            voiceChannel: voiceChannel,
            connection: null,
            message: null,
            audioPlayer: createAudioPlayer(),
            station: station
        };
        client.radio.set(interaction.guild.id, construct);

        try {
            const connection =
                getVoiceConnection(voiceChannel.guild.id) ??
                joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator
                });
            construct.connection = connection;
            let date = new Date();
            construct.startTime = date.getTime();
            client.funcs.play(interaction, interaction.guild, client, url, Discord);

            client.datastore.checkEntry(interaction.guild.id);
            construct.currentGuild = client.datastore.getEntry(interaction.guild.id);

            if (!construct.currentGuild.statistics[construct.station.name]) {
                construct.currentGuild.statistics[construct.station.name] = {};
                construct.currentGuild.statistics[construct.station.name].time = 0;
                construct.currentGuild.statistics[construct.station.name].used = 0;
                client.datastore.updateEntry(interaction.guild, construct.currentGuild);
            }
        } catch (error) {
            console.log(error);
            client.radio.delete(interaction.guild.id);
            return interaction.reply(client.messageEmojis["error"] + `An error occured: ${error}`);
        }
    }
};