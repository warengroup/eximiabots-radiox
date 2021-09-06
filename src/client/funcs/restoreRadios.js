import Discord from "discord.js";
const {
    createAudioPlayer,
    getVoiceConnection,
    joinVoiceChannel
} = require("@discordjs/voice");

module.exports = async function restoreRadios(client, guilds) {
    if(!client.stations) return;

    guilds.forEach(async guild => {
        let state = client.funcs.loadState(client, guild);
        if(!state) return;
        if(!state.station || !state.channels.voice || !state.channels.text) return;
        let voiceChannel = client.channels.cache.get(state.channels.voice);
        if(!voiceChannel) return;
        if(voiceChannel.members.size === 0) return;


        const sstation = await client.funcs.searchStation(state.station.name, client);
        let url = sstation.stream[sstation.stream.default];
        let station = sstation;

        const construct = {
            textChannel: client.channels.cache.get(state.channels.text),
            voiceChannel: client.channels.cache.get(state.channels.voice),
            connection: null,
            message: null,
            audioPlayer: createAudioPlayer(),
            station: station
        };
        client.radio.set(guild.id, construct);

        try {
            const connection =
                getVoiceConnection(guild.id) ??
                joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator
                });

            construct.connection = connection;
            let date = new Date();
            construct.startTime = date.getTime();
            
            client.funcs.play(null, guild, client, url, Discord);

            client.datastore.checkEntry(guild.id);
            construct.datastore = client.datastore.getEntry(guild.id);

            if (!construct.datastore.statistics[construct.station.name]) {
                construct.datastore.statistics[construct.station.name] = {};
                construct.datastore.statistics[construct.station.name].time = 0;
                construct.datastore.statistics[construct.station.name].used = 0;
                client.datastore.updateEntry(guild, construct.datastore);
            }
        } catch (error) {
            console.log(error);
        }
    });
}