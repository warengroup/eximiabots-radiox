import { Channel, Collection, GuildMember, OAuth2Guild, TextBasedChannel, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import RadioClient from "../../Client";
import { station } from "./Stations";
import { datastore } from "./Datastore";

export interface radio {
    textChannel: Channel | TextBasedChannel | undefined | null,
    voiceChannel: Channel | VoiceBasedChannel | undefined,
    connection: VoiceConnection | null,
    message: null,
    station: station,
    datastore?: datastore,
    currentTime?: number,
    startTime: number,
    playTime?: number,
}

export interface state {
    channels: {
        "text": string | undefined,
        "voice": string | undefined
    },
    date: string,
    station: {
        name: string,
        owner: string
    }
}

export default class Radio extends Map {

    constructor() {
        super();
    }

    save(client: RadioClient): void {
        let currentRadios = this.keys();
        let radio = currentRadios.next();

        while (!radio.done) {
            let currentRadio = this.get(radio.value);

            if (currentRadio) {
                currentRadio.guild = client.datastore?.getEntry(radio.value)?.guild;

                client.statistics?.update(client, currentRadio.guild, currentRadio);
                client.funcs.saveState(client, currentRadio.guild, currentRadio);
                currentRadio.connection?.destroy();
                currentRadio.message?.delete();
                this.delete(radio.value);
            }

            radio = currentRadios.next();
        }
    }

    restore(client: RadioClient, guilds: Collection<string, OAuth2Guild>): void {
        if(!client.stations) return;

        guilds.forEach(async (guild: OAuth2Guild) => {
            let state = client.funcs.loadState(client, guild);

            if(!state) return;
            if(state.channels?.text === undefined || state.channels?.voice === undefined) return;

            let voiceChannel = client.channels.cache.get(state.channels.voice);
            if(!voiceChannel || !(voiceChannel instanceof VoiceChannel)) return;
            if(voiceChannel.members.filter((member: GuildMember) => !member.user.bot).size === 0) return;

            const sstation = client.stations?.search(state.station.name, "direct");
            let station = sstation;

            if(!station) return;

            let date = new Date();
            const construct: radio = {
                textChannel: client.channels.cache.get(state.channels.text),
                voiceChannel: client.channels.cache.get(state.channels.voice),
                connection: null,
                message: null,
                station: station,
                startTime: date.getTime()
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
                client.datastore?.checkEntry(guild.id);

                client.funcs.play(client, null, guild, station);
            } catch (error) {
                console.log(error);
            }
        });
    }

};
