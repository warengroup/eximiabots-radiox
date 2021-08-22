const {
    getVoiceConnection,
    joinVoiceChannel
} = require("@discordjs/voice");
const { createDiscordJSAdapter } = require("../utils/adapter");

module.exports = {
    name: "voiceStateUpdate",
    async execute(client, oldState, newState) {
        if (oldState.channel === null) return;
        let change = false;
        const radio = client.radio.get(newState.guild.id);
        if (!radio) return;

        if (newState.member.id === client.user.id && oldState.member.id === client.user.id) {

            if (newState.channel === null) {
                client.funcs.statisticsUpdate(client, newState.guild, radio);
                radio.connection?.destroy();
                radio.audioPlayer?.stop();
                client.funcs.logger('Radio', 'Stream stopped' + " / " + newState.guild.id);
                return client.radio.delete(newState.guild.id);
            }

            const newPermissions = newState.channel.permissionsFor(newState.client.user);
            if (!newPermissions.has("CONNECT") || !newPermissions.has("SPEAK") || !newPermissions.has("VIEW_CHANNEL")) {
                try {
                    setTimeout(
                        async () => (
                            radio.connection = joinVoiceChannel({
                                channelId: oldState.channel.id,
                                guildId: oldState.channel.guild.id,
                                adapterCreator: createDiscordJSAdapter(oldState.channel)
                            })
                            //radio.connection = await oldState.channel.join()
                        ),
                        1000
                    );
                } catch (error) {
                    client.funcs.statisticsUpdate(client, newState.guild, radio);
                    radio.connection?.destroy();
                    radio.audioPlayer?.stop();
                    client.funcs.logger('Radio', 'Stream stopped' + " / " + newState.guild.id);
                    client.radio.delete(oldState.guild.id);
                }
                return;
            }
            if (newState.channel !== radio.voiceChannel) {
                change = true;
                radio.voiceChannel = newState.channel;
                radio.connection = getVoiceConnection(newState.channel.guild.id);
                //radio.connection = await newState.channel.join();
            }
        }
        if ((oldState.channel.members.size === 1 && oldState.channel === radio.voiceChannel) || change) {
            setTimeout(() => {
                if (!radio || !radio.connection || !radio.connection === null) return;
                if (radio.voiceChannel.members.size === 1) {
                    client.funcs.statisticsUpdate(client, newState.guild, radio);
                    radio.connection?.destroy();
                    radio.audioPlayer?.stop();
                    client.funcs.logger('Radio', 'Stream stopped' + " / " + newState.guild.id);
                    client.radio.delete(newState.guild.id);
                }
            }, 60000);
        }
    },
};
