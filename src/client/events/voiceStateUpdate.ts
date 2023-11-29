import { GuildMember, PermissionFlagsBits, VoiceState } from "discord.js";
import RadioClient from "../../Client";
const {
    getVoiceConnection,
    joinVoiceChannel
} = require("@discordjs/voice");

export default async function voiceStateUpdate(client: RadioClient, oldState: VoiceState, newState: VoiceState) {
    if (oldState.channel === null) return;
    let change = false;
    const radio = client.radio?.get(newState.guild.id);
    if (!radio) return;

    if (newState.member?.id === client.user?.id && oldState.member?.id === client.user?.id) {

        if (newState.channel === null) {
            client.statistics?.update(client, newState.guild, radio);
            radio.connection?.destroy();
            radio.message?.delete();
            client.funcs.logger('Radio', newState.guild.id + " / " + 'Stop');
            return client.radio?.delete(newState.guild.id);
        }

        const newPermissions = newState.channel.permissionsFor(newState.client.user);
        if (!newPermissions?.has(PermissionFlagsBits.Connect) || !newPermissions?.has(PermissionFlagsBits.Speak) || !newPermissions?.has(PermissionFlagsBits.ViewChannel)) {
            try {
                setTimeout(
                    async () => (
                        radio.connection = joinVoiceChannel({
                            channelId: oldState.channel?.id,
                            guildId: oldState.channel?.guild.id,
                            adapterCreator: oldState.channel?.guild.voiceAdapterCreator
                        })
                    ),
                    1000
                );
            } catch (error) {
                client.statistics?.update(client, newState.guild, radio);
                radio.connection?.destroy();
                radio.message?.delete();
                client.funcs.logger('Radio', newState.guild.id + " / " + 'Stop');
                client.radio?.delete(oldState.guild.id);
            }
            return;
        }
        if (newState.channel !== radio.voiceChannel) {
            change = true;
            radio.voiceChannel = newState.channel;
            radio.connection = getVoiceConnection(newState.channel.guild.id);

        }
    }
    if ((oldState.channel.members.filter(member => !member.user.bot).size === 0 && oldState.channel === radio.voiceChannel) || change) {
        setTimeout(() => {
            if (!radio || !radio.connection || !radio.connection === null) return;
            if (radio.voiceChannel?.members.filter((member: GuildMember) => !member.user.bot).size === 0) {
                client.statistics?.update(client, newState.guild, radio);
                radio.connection?.destroy();
                radio.message?.delete();
                client.funcs.logger('Radio', newState.guild.id + " / " + 'Stop');
                client.radio?.delete(newState.guild.id);
            }
        }, 5000);
    }
};
