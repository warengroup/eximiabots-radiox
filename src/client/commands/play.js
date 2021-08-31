const {
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel
} = require("@discordjs/voice");

module.exports = {
    name: "play",
    alias: "p",
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
            const sstation = await searchStation(query, client);
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
            
            radio.station = station;
            radio.textChannel = interaction.channel;
            play(interaction, interaction.guild, client, url, Discord);

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
            play(interaction, interaction.guild, client, url, Discord);

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

async function play(interaction, guild, client, url, Discord) {
    let message = {};
    const radio = client.radio.get(guild.id);
    const resource = createAudioResource(url);
    radio.connection.subscribe(radio.audioPlayer);
    radio.audioPlayer.play(resource);
    resource.playStream
        .on("readable", () => {
            client.funcs.logger('Radio', 'Stream started' + " / " + guild.id + " / " + radio.station.name);
        })
        .on("finish", () => {
            client.funcs.logger('Radio', 'Stream finished' + " / " + guild.id);
            client.funcs.statisticsUpdate(client, guild, radio);
            radio.connection?.destroy();
            radio.audioPlayer?.stop();
            client.radio.delete(guild.id);
            return;
        })
        .on("error", error => {
            client.funcs.logger('Radio', 'Stream errored');
            console.error(error);
            radio.connection?.destroy();
            radio.audioPlayer?.stop();
            client.radio.delete(guild.id);
            return interaction.reply(client.messages.errorPlaying);
        });

    message.nowplayingDescription = client.messages.nowplayingDescription.replace("%radio.station.name%", radio.station.name);
    message.nowplayingDescription = message.nowplayingDescription.replace("%radio.station.owner%", radio.station.owner);
    message.nowplayingDescription = message.nowplayingDescription.replace("%client.funcs.msToTime(completed)%", "");
    message.nowplayingDescription = message.nowplayingDescription.replace("**", "");
    message.nowplayingDescription = message.nowplayingDescription.replace("**", "");

    const embed = new Discord.MessageEmbed()
        .setTitle(client.user.username)
        .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["play"].replace(/[^0-9]+/g, ''))
        .setColor(client.config.embedColor)
        .addField(client.messages.nowplayingTitle, message.nowplayingDescription, true)
        .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
    
    const buttons = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('list')
                .setEmoji(client.messageEmojis["list"])
                .setStyle('PRIMARY')
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('prev')
                .setEmoji(client.messageEmojis["prev"])
                .setStyle('PRIMARY')
                .setDisabled(true)
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('stop')
                .setEmoji(client.messageEmojis["stop"])
                .setStyle('PRIMARY')
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('next')
                .setEmoji(client.messageEmojis["next"])
                .setStyle('PRIMARY')
                .setDisabled(true)
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('statistics')
                .setEmoji(client.messageEmojis["statistics"])
                .setStyle('PRIMARY')
        );

    if(!radio.message){
        radio.message = await radio.textChannel.send({ embeds: [embed], components: [buttons] });
    } else {
        radio.message.edit({ embeds: [embed], components: [buttons] });
    }

    message.play = client.messages.play.replace("%radio.station.name%", radio.station.name);
    
    interaction.reply({
        content: client.messageEmojis["play"] + message.play,
        ephemeral: true
    });
    
}

function searchStation(key, client) {
    if (client.stations === null) return false;
    let foundStations = [];
    if (!key) return false;
    if (key == "radio") return false;

    client.stations
        .filter(
            x => x.name.toUpperCase().includes(key.toUpperCase()) || x === key
        )
        .forEach(x =>
            foundStations.push({ station: x, name: x.name, probability: 100 })
        );

    if (key.startsWith("radio ")) key = key.slice(6);
    const probabilityIncrement = 100 / key.split(" ").length / 2;
    for (let i = 0; i < key.split(" ").length; i++) {
        client.stations
            .filter(
                x => x.name.toUpperCase().includes(key.split(" ")[i].toUpperCase()) || x === key
            )
            .forEach(x =>
                foundStations.push({ station: x, name: x.name, probability: probabilityIncrement })
            );
    }
    if (foundStations.length === 0) return false;
    for (let i = 0; i < foundStations.length; i++) {
        for (let j = 0; j < foundStations.length; j++) {
            if (foundStations[i] === foundStations[j] && i !== j) foundStations.splice(i, 1);
        }
    }
    for (let i = 0; i < foundStations.length; i++) {
        if (foundStations[i].name.length > key.length) {
            foundStations[i].probability -=
                (foundStations[i].name.split(" ").length - key.split(" ").length) *
                (probabilityIncrement * 0.5);
        } else if (foundStations[i].name.length === key.length) {
            foundStations[i].probability += probabilityIncrement * 0.9;
        }

        for (let j = 0; j < key.split(" ").length; j++) {
            if (!foundStations[i].name.toUpperCase().includes(key.toUpperCase().split(" ")[j])) {
                foundStations[i].probability -= probabilityIncrement * 0.5;
            }
        }
    }
    let highestProbabilityStation;
    for (let i = 0; i < foundStations.length; i++) {
        if (
            !highestProbabilityStation ||
            highestProbabilityStation.probability < foundStations[i].probability
        )
            highestProbabilityStation = foundStations[i];
        if (
            highestProbabilityStation &&
            highestProbabilityStation.probability === foundStations[i].probability
        ) {
            highestProbabilityStation = foundStations[i].station;
        }
    }
    return highestProbabilityStation;
}
