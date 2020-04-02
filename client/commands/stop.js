module.exports = {
	name: 'stop',
	description: 'Stop command.',
	alias: 's',
	usage: '',
	permission: 'none',
	category: 'music',
	execute(msg, args, client, Discord, command) {
		const radio = client.radio.get(msg.guild.id);
		if (client.funcs.check(client, msg, command)) {
            statisticsUpdate(client, msg.guild, radio);
			radio.connection.dispatcher.destroy();
			radio.voiceChannel.leave();
			client.radio.delete(msg.guild.id);
			msg.channel.send(client.messageEmojis["stop"] + client.messages.stop);
		}
	}
};

function statisticsUpdate(client, guild, radio) {
    client.datastore.checkEntry(guild.id);
    radio.currentGuild = client.datastore.getEntry(guild.id);
    if(!radio.currentGuild.statistics[radio.station.name]){
        radio.currentGuild.statistics[radio.station.name] = {};
        radio.currentGuild.statistics[radio.station.name].time = 0;
        radio.currentGuild.statistics[radio.station.name].used = 0;
        client.datastore.updateEntry(guild, radio.currentGuild);
    }

    radio.currentGuild.statistics[radio.station.name].time = parseInt(radio.currentGuild.statistics[radio.station.name].time)+parseInt(radio.connection.dispatcher.streamTime.toFixed(0));
    radio.currentGuild.statistics[radio.station.name].used = parseInt(radio.currentGuild.statistics[radio.station.name].used)+1;
    client.datastore.updateEntry(guild, radio.currentGuild);
}