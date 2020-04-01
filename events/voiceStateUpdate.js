module.exports = {
    name: 'voiceStateUpdate',
    async execute(client, oldState, newState) {
        if (oldState.channel === null) return;
        let change = false;
        const radio = client.radio.get(newState.guild.id);
        if (!radio) return;
        if (newState.member.id === client.user.id && oldState.member.id === client.user.id) {
            if (newState.channel === null) {
                statisticsUpdate(client, newState, radio);
                return client.radio.delete(newState.guild.id);
            }

            const newPermissions = newState.channel.permissionsFor(newState.client.user);
            if (!newPermissions.has('CONNECT') || !newPermissions.has('SPEAK') || !newPermissions.has('VIEW_CHANNEL')) {
                try {
                    const connection = await oldState.channel.join();
                    return radio.connection = connection;
                } catch (error) {
                    statisticsUpdate(client, newState, radio);
                    radio.connection.dispatcher.destroy();
                    radio.voiceChannel.leave();
                    client.radio.delete(oldState.guild.id);
                    return;
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
                    statisticsUpdate(client, newState, radio);
                    radio.connection.dispatcher.destroy();
                    radio.voiceChannel.leave();
                    client.radio.delete(newState.guild.id);
                }
            }, 120000);
        }
    }
};

function statisticsUpdate(client, currentState, radio) {
    
    client.datastore.checkEntry(currentState.guild.id);
    
    radio.currentGuild = client.datastore.getEntry(currentState.guild.id);
    
    if(!radio.currentGuild.statistics[radio.station.name]){
        radio.currentGuild.statistics[radio.station.name] = {};
        radio.currentGuild.statistics[radio.station.name].time = 0;
        radio.currentGuild.statistics[radio.station.name].used = 0;
        client.datastore.updateEntry(currentState.guild, radio.currentGuild);
    }
    
    if(!radio.connection.dispatcher){
        let date = new Date();
        radio.currentTime = date.getTime();
        radio.playTime = parseInt(radio.currentTime)-parseInt(radio.startTime);
        radio.currentGuild.statistics[radio.station.name].time = parseInt(radio.currentGuild.statistics[radio.station.name].time)+parseInt(radio.playTime);
    } else {
        radio.currentGuild.statistics[radio.station.name].time = parseInt(radio.currentGuild.statistics[radio.station.name].time)+parseInt(radio.connection.dispatcher.streamTime.toFixed(0));
    }
    
    radio.currentGuild.statistics[radio.station.name].used = parseInt(radio.currentGuild.statistics[radio.station.name].used)+1;
    client.datastore.updateEntry(currentState.guild, radio.currentGuild);
    
}