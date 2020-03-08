module.exports = {
	name: 'play',
	alias: 'p',
	usage: '<song name>',
	description: 'Play some music.',
	permission: 'none',
	category: 'music',
	async execute(msg, args, client, Discord, prefix) {
		const station = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
		const radio = client.radio.get(msg.guild.id);
		const voiceChannel = msg.member.voice.channel;
		if (!radio) {
			if (!msg.member.voice.channel) return msg.channel.send('<:redx:674263474704220182> I\'m sorry but you need to be in a voice channel to play music!');
		} else {
			if (voiceChannel !== radio.voiceChannel) return msg.channel.send('<:redx:674263474704220182> I\'m sorry but you need to be in the same voice channel as RadioX to play music!');
		}
		if (!args[1]) return msg.channel.send('<:redx:674263474704220182> You need to use a link or search for a song!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('<:redx:674263474704220182> I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('<:redx:674263474704220182> I cannot speak in your voice channel, make sure I have the proper permissions!');
		}

		if (radio) {
			radio.connection.dispatcher.destroy();
            radio.station = station;
			client.funcs.play(msg.guild, client, station);
			return;
		}
        
        const construct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			playing: false,
			station: station-1,
			name: null,
			volume: client.config.volume,
		};
		client.radio.set(msg.guild.id, construct);
        
		try {
			const connection = await voiceChannel.join();
			construct.connection = connection;
			client.funcs.play(msg.guild, client, station);
		} catch (error) {
			client.radio.delete(msg.guild.id);
			client.debug_channel.send("Error with connecting to voice channel: " + error);
			return msg.channel.send(`<:redx:674263474704220182> An error occured: ${error}`);
		}
	}
};
