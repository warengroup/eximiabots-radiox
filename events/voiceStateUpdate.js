module.exports = {
    name: 'voiceStateUpdate',
    async execute(client, oldState, newState) {
        let change = false;
        const radio = client.radio.get(newState.guild.id);
        if (!radio) return;
        if (newState.member.id === client.user.id && oldState.member.id === client.user.id) {
            if (newState.member.voice.channel === null) {
                radio.songs = [];
                radio.looping = false;
                radio.endReason = "manual disconnect";
                return client.radio.delete(newState.guild.id);
            }
            if (newState.member.voice.channel !== radio.voiceChannel) {
                change = true;
                radio.voiceChannel = newState.member.voice.channel;
                radio.connection = newState.connection;
            }
        }
        if (oldState.channel === null) return;
        if (oldState.channel.members.size === 1 && oldState.channel === radio.voiceChannel || change) {
            setTimeout(() => {
                if (!radio) return;
                if (radio.voiceChannel.members.size === 1) {
                    radio.songs = [];
                    radio.looping = false;
                    radio.connection.dispatcher.destroy();
                }
            }, 12000);
        }
    }
}