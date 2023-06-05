import RadioClient from "../../Client";
import { command } from "../commands";
export default function check(client: RadioClient, interaction: any, command: command) {
    let message: any = {};
    const radio = client.radio?.get(interaction.guild.id);
    if(!client.stations) {
        message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
        interaction.reply({
            content: client.messages.emojis["error"] + message.errorToGetPlaylist,
            ephemeral: true
        });
        return false;
    }
    if (!radio) {
        interaction.reply({
            content: client.messages.emojis["error"] + client.messages.notPlaying,
            ephemeral: true
        });
        return false;
    }
    if (interaction.member.voice.channel !== radio.voiceChannel) {
        interaction.reply({
            content: client.messages.emojis["error"] + client.messages.wrongVoiceChannel,
            ephemeral: true
        });
        return false;
    }

    return true;
};
