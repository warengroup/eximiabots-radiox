import { ButtonInteraction, ChatInputCommandInteraction, GuildMember, StringSelectMenuInteraction } from "discord.js";
import RadioClient from "../../Client";
import { command } from "../commands";

export default function check(client: RadioClient, interaction: ButtonInteraction | ChatInputCommandInteraction | StringSelectMenuInteraction, command: command) {

    if(!interaction.guild) return;
    const radio = client.radio?.get(interaction.guild?.id);
    if(!client.stations) {
        interaction.reply({
            content: client.messages.emojis["error"] + client.messages.replace(client.messages.errorToGetPlaylist, {
                "%client.config.supportGuild%": client.config.supportGuild
            }),
            flags: 'Ephemeral'
        });
        return false;
    }
    if (!radio) {
        interaction.reply({
            content: client.messages.emojis["error"] + client.messages.notPlaying,
            flags: 'Ephemeral'
        });
        return false;
    }

    if (interaction.member instanceof GuildMember && interaction.member?.voice.channel !== radio.voiceChannel) {
        interaction.reply({
            content: client.messages.emojis["error"] + client.messages.wrongVoiceChannel,
            flags: 'Ephemeral'
        });
        return false;
    }

    return true;
};
