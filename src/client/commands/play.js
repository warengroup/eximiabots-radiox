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
    description: "Play some music.",
    permission: "none",
    category: "radio",
    async execute(msg, args, client, Discord, command) {
        let message = {};
        let url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
        const radio = client.radio.get(msg.guild.id);
        const voiceChannel = msg.member.voice.channel;
        if (!radio) {
            if (!msg.member.voice.channel)
                return msg.channel.send(
                    client.messageEmojis["error"] + client.messages.noVoiceChannel
                );
        } else {
            if (voiceChannel !== radio.voiceChannel)
                return msg.channel.send(
                    client.messageEmojis["error"] + client.messages.wrongVoiceChannel
                );
        }
        if (!client.stations) {
            message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace(
                "%client.config.supportGuild%",
                client.config.supportGuild
            );
            return msg.channel.send(client.messageEmojis["error"] + message.errorToGetPlaylist);
        }
        if (!args[1]) return msg.channel.send(client.messages.noQuery);
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has("CONNECT")) {
            return msg.channel.send(client.messageEmojis["error"] + client.messages.noPermsConnect);
        }
        if (!permissions.has("SPEAK")) {
            return msg.channel.send(client.messageEmojis["error"] + client.messages.noPermsSpeak);
        }
        let station;
        const number = parseInt(args[1] - 1);
        if (url.startsWith("http")) {
            return msg.channel.send(
                client.messageEmojis["error"] + client.messages.errorStationURL
            );
        } else if (!isNaN(number)) {
            if (number > client.stations.length - 1) {
                return msg.channel.send(
                    client.messageEmojis["error"] + client.messages.wrongStationNumber
                );
            } else {
                url = client.stations[number].stream[client.stations[number].stream.default];
                station = client.stations[number];
            }
        } else {
            if (args[1].length < 3)
                return msg.channel.send(
                    client.messageEmojis["error"] + client.messages.tooShortSearch
                );
            const sstation = await searchStation(args.slice(1).join(" "), client);
            if (!sstation)
                return msg.channel.send(
                    client.messageEmojis["error"] + client.messages.noSearchResults
                );
            url = sstation.stream[sstation.stream.default];
            station = sstation;
        }

        if (radio) {
            client.funcs.statisticsUpdate(client, msg.guild, radio);
            radio.audioPlayer.stop();
            
            radio.station = station;
            radio.textChannel = msg.channel;
            play(msg.guild, client, url);

            return;
        }

        const construct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            audioPlayer: createAudioPlayer(),
            station: station
        };
        client.radio.set(msg.guild.id, construct);

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
            play(msg.guild, client, url);

            client.datastore.checkEntry(msg.guild.id);
            construct.currentGuild = client.datastore.getEntry(msg.guild.id);

            if (!construct.currentGuild.statistics[construct.station.name]) {
                construct.currentGuild.statistics[construct.station.name] = {};
                construct.currentGuild.statistics[construct.station.name].time = 0;
                construct.currentGuild.statistics[construct.station.name].used = 0;
                client.datastore.updateEntry(msg.guild, construct.currentGuild);
            }
        } catch (error) {
            console.log(error);
            client.radio.delete(msg.guild.id);
            return msg.channel.send(client.messageEmojis["error"] + `An error occured: ${error}`);
        }
    }
};
function play(guild, client, url) {
    let message = {};
    const radio = client.radio.get(guild.id);
    const resource = createAudioResource(url);
    radio.connection.subscribe(radio.audioPlayer);
    radio.audioPlayer.play(resource);
    resource.playStream
        .on("readable", () => {
            console.log("Stream started");
        })
        .on("finish", () => {
            console.log("Stream finished");
            client.funcs.statisticsUpdate(client, guild, radio);
            radio.connection.destroy();
            client.radio.delete(guild.id);
            return;
        })
        .on("error", error => {
            console.error(error);
            radio.connection.destroy();
            client.radio.delete(guild.id);
            return radio.textChannel.send(client.messages.errorPlaying);
        });

    message.play = client.messages.play.replace("%radio.station.name%", radio.station.name);
    radio.textChannel.send(client.messageEmojis["play"] + message.play);
}

function searchStation(key, client) {
    if (client.stations === null) return false;
    let foundStations = [];
    if (!key) return false;
    if (key == "radio") return false;
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
