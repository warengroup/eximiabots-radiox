import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, StringSelectMenuInteraction } from "discord.js";
import { DiscordGatewayAdapterCreator, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import RadioClient from "../../Client";
import { radio } from "../classes/Radio"

export default {
    name: "play",
    usage: "<song name>",
    description: "Play radio",
    options: [
        { type: ApplicationCommandOptionType.String, name: "query", description: "Select station", required: false}
    ],
    category: "radio",
    async execute(interaction: ChatInputCommandInteraction | StringSelectMenuInteraction, client: RadioClient) {

        if(!interaction.guild) return;

        if(client.config.maintenanceMode){
            return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.maintenance,
                flags: 'Ephemeral'
            });
        }

        if(!client.stations) {
            return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.replace(client.messages.errorToGetPlaylist, {
                    "%client.config.supportGuild%": client.config.supportGuild
                }),
                flags: 'Ephemeral'
            });
        }

        let query: string | null = null;

        if(interaction.isChatInputCommand()){
            query = interaction.options?.getString("query");
        }

        if(interaction.isStringSelectMenu()){
            query = interaction.values?.[0];
        }

        if(!query){
            return client.funcs.listStations(client, interaction, "1");
        }

        const radio = client.radio?.get(interaction.guild.id);

        if(!(interaction.member instanceof GuildMember)) return;
        const voiceChannel = interaction.member?.voice.channel;

        if (!voiceChannel) return interaction.reply({
            content: client.messages.emojis["error"] + client.messages.noVoiceChannel,
            flags: 'Ephemeral'
        });

        if (radio) {
            if (voiceChannel !== radio.voiceChannel) return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.wrongVoiceChannel,
                flags: 'Ephemeral'
            });
        }

        if (!query) return interaction.reply({
            content: client.messages.noQuery,
            flags: 'Ephemeral'
        });

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions?.has(PermissionFlagsBits.Connect)) {
            return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.noPermsConnect,
                flags: 'Ephemeral'
            });
        }
        if (!permissions?.has(PermissionFlagsBits.Speak)) {
            return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.noPermsSpeak,
                flags: 'Ephemeral'
            });
        }
        let station;

        if(!isNaN(parseInt(query) - 1)){
            let number = parseInt(query) - 1;
            if(number > client.stations.length - 1) {
                return interaction.reply({
                    content: client.messages.emojis["error"] + client.messages.wrongStationNumber,
                    flags: 'Ephemeral'
                });
            } else {
                station = client.stations[number];
            }
        } else {

            if(query.length < 3) return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.tooShortSearch,
                flags: 'Ephemeral'
            });

            let type = "text";

            if(interaction.isStringSelectMenu() && interaction.values?.[0]){
                type = "direct";
            }

            const sstation = client.stations.search(query, type);
            if (!sstation) return interaction.reply({
                content: client.messages.emojis["error"] + client.messages.noSearchResults,
                flags: 'Ephemeral'
            });
            station = sstation;
        }

        if (radio) {
            client.statistics?.update(client, interaction.guild, radio);

            let date = new Date();
            radio.station = station;
            radio.textChannel = interaction.channel;
            radio.startTime = date.getTime();
            client.funcs.play(client, interaction, interaction.guild, station);

            return;
        }

        let date = new Date();
        const construct: radio = {
            textChannel: interaction.channel,
            voiceChannel: voiceChannel,
            connection: undefined,
            message: null,
            station: station,
            startTime: date.getTime(),
            guild: interaction.guild
        };
        client.radio?.set(interaction.guild?.id, construct);

        try {
            const connection =
                getVoiceConnection(voiceChannel.guild.id) ??
                joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator
                });
            construct.connection = connection;
            let date = new Date();
            construct.startTime = date.getTime();
            client.datastore?.checkEntry(interaction.guild?.id);
            client.funcs.play(client, interaction, interaction.guild, station);
        } catch (error) {
            console.log(error);
            client.radio?.delete(interaction.guild?.id);
            return interaction.reply({
                content: client.messages.emojis["error"] + `An error occured: ${error}`,
                flags: 'Ephemeral'
            });
        }
    }
};
