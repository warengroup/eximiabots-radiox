const {
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
    category: "radio",
    async execute(interaction, client) {
        let message = {};

        if(client.config.maintenance){
            interaction.reply({
                content: client.messageEmojis["error"] + client.messages.maintenance,
                ephemeral: true
            });
            return false;
        }

        if(!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
            return interaction.reply({
                content: client.messageEmojis["error"] + message.errorToGetPlaylist,
                ephemeral: true
            });
        }

        let query = interaction.options?.getString("query") ?? interaction.values?.[0];
        if(!query){
            return client.funcs.listStations(client, interaction);
        }
        let url = query ? query.replace(/<(.+)>/g, "$1") : "";
        const radio = client.radio.get(interaction.guild.id);
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply({
            content: client.messageEmojis["error"] + client.messages.noVoiceChannel,
            ephemeral: true
        });
        if (radio) {
            if (voiceChannel !== radio.voiceChannel) return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.wrongVoiceChannel,
                ephemeral: true
            });
        }
        if (!query) return interaction.reply({
            content: client.messages.noQuery,
            ephemeral: true
        });
        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has("CONNECT")) {
            return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.noPermsConnect,
                ephemeral: true
            });
        }
        if (!permissions.has("SPEAK")) {
            return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.noPermsSpeak,
                ephemeral: true
            });
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
                station = client.stations[number];
            }
        } else {
            if (query.length < 3) return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.tooShortSearch,
                ephemeral: true
            });
            const sstation = await client.funcs.searchStation(query, client);
            if (!sstation) return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.noSearchResults,
                ephemeral: true
            });
            station = sstation;
        }

        if (radio) {
            client.funcs.statisticsUpdate(client, interaction.guild, radio);

            let date = new Date();
            radio.station = station;
            radio.textChannel = interaction.channel;
            radio.startTime = date.getTime();
            client.funcs.play(client, interaction, interaction.guild, station);

            return;
        }

        const construct = {
            textChannel: interaction.channel,
            voiceChannel: voiceChannel,
            connection: null,
            message: null,
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
            client.funcs.play(client, interaction, interaction.guild, station);

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
            return interaction.reply({
                content: client.messageEmojis["error"] + `An error occured: ${error}`,
                ephemeral: true
            });
        }
    }
};
