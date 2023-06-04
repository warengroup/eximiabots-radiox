import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";

export default {
    name: "play",
    usage: "<song name>",
    description: "Play radio",
    options: [
        { type: ApplicationCommandOptionType.String, name: "query", description: "Select station", required: false}
    ],
    category: "radio",
    async execute(interaction: any, client: any) {
        let message: any = {};

        if(client.config.maintenanceMode){
            return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.maintenance,
                ephemeral: true
            });
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
        if (!permissions.has(PermissionFlagsBits.Connect)) {
            return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.noPermsConnect,
                ephemeral: true
            });
        }
        if (!permissions.has(PermissionFlagsBits.Speak)) {
            return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.noPermsSpeak,
                ephemeral: true
            });
        }
        let station;

        if (!isNaN(query)) {
            const number = parseInt((query - 1) as unknown as string);
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

            let type = "";

            if(interaction.values?.[0]){
                type = "direct";
            } else {
                type = "text";
            }

            const sstation = await client.stations.search(query, type);
            if (!sstation) return interaction.reply({
                content: client.messageEmojis["error"] + client.messages.noSearchResults,
                ephemeral: true
            });
            station = sstation;
        }

        if (radio) {
            client.statistics.update(client, interaction.guild, radio);

            let date = new Date();
            radio.station = station;
            radio.textChannel = interaction.channel;
            radio.startTime = date.getTime();
            client.funcs.play(client, interaction, interaction.guild, station);

            return;
        }

        let date = new Date();
        const construct: any = {
            textChannel: interaction.channel,
            voiceChannel: voiceChannel,
            connection: null,
            message: null,
            station: station,
            startTime: date.getTime()
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
            client.datastore.checkEntry(interaction.guild.id);
            client.funcs.play(client, interaction, interaction.guild, station);
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
