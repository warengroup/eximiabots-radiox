module.exports = {
    name: 'voiceStateUpdate',
    async execute(client, oldState, newState) {
        if (oldState.channel === null) return;
        let change = false;
        const radio = client.radio.get(newState.guild.id);
        if (!radio) return;
        if (newState.member.id === client.user.id && oldState.member.id === client.user.id) {
            if (newState.channel === null) {
                radio.songs = [];
                radio.looping = false;
                return client.radio.delete(newState.guild.id);
            }

            const newPermissions = newState.channel.permissionsFor(newState.client.user);
            if (!newPermissions.has('CONNECT') || !newPermissions.has('SPEAK') || !newPermissions.has('VIEW_CHANNEL')) {
                try {
                    const connection = await oldState.channel.join();
                    return radio.connection = connection;
                } catch (error) {
                    radio.songs = [];
                    radio.looping = false;
                    radio.connection.dispatcher.destroy();
                    radio.voiceChannel.leave();
                    client.radio.delete(msg.guild.id);
                    client.debug_channel.send("Error with connecting to voice channel: " + error);
                    return msg.channel.send(`<:redx:674263474704220182> An error occured: ${error}`);
                }
            }
            if (newState.channel !== radio.voiceChannel) {
                change = true;
                radio.voiceChannel = newState.channel;
                radio.connection = newState.connection;
            }
        }
        if (oldState.channel.members.size === 1 && oldState.channel === radio.voiceChannel || change) {
            setTimeout(() => {
                if (!radio) return;
                if (radio.voiceChannel.members.size === 1) {
                    radio.songs = [];
                    radio.looping = false;
                    radio.connection.dispatcher.destroy();
                    radio.voiceChannel.leave();
                    client.radio.delete(newState.guild.id);
                }
            }, 120000);
        }
    }
}