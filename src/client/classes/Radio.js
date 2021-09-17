const {
    getVoiceConnection,
    joinVoiceChannel
} = require("@discordjs/voice");

module.exports = class Radio extends Map {
    constructor() {
        super();
    }

    save(client) {
        let currentRadios = this.keys();
        let radio = currentRadios.next();

        while (!radio.done) {
            let currentRadio = this.get(radio.value);

            if (currentRadio) {
                currentRadio.guild = client.datastore.getEntry(radio.value).guild;

                client.statistics.update(client, currentRadio.guild, currentRadio);
                client.funcs.saveState(client, currentRadio.guild, currentRadio);
                currentRadio.connection?.destroy();
                currentRadio.message?.delete();
                this.delete(radio.value);
            }

            radio = currentRadios.next();
        }
    }

    restore(client, guilds) {
        if(!client.stations) return;

        guilds.forEach(async guild => {
            let state = client.funcs.loadState(client, guild);
            if(!state) return;
            if(!state.station || !state.channels.voice || !state.channels.text) return;
            let voiceChannel = client.channels.cache.get(state.channels.voice);
            if(!voiceChannel) return;
            if(voiceChannel.members.filter(member => !member.user.bot).size === 0) return;


            const sstation = await client.stations.search(state.station.name);
            let station = sstation;

            const construct = {
                textChannel: client.channels.cache.get(state.channels.text),
                voiceChannel: client.channels.cache.get(state.channels.voice),
                connection: null,
                message: null,
                station: station
            };
            this.set(guild.id, construct);

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
                client.datastore.checkEntry(guild.id);
                client.funcs.play(client, null, guild, station);
            } catch (error) {
                console.log(error);
            }
        });
    }

};
