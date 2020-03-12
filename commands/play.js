module.exports = {
	name: 'play',
	alias: 'p',
	usage: '<song name>',
	description: 'Play some music.',
	permission: 'none',
	category: 'music',
	async execute(msg, args, client, Discord, prefix) {
		let url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
		const radio = client.radio.get(msg.guild.id);
		const voiceChannel = msg.member.voice.channel;
		if (!radio) {
			if (!msg.member.voice.channel) return msg.channel.send('You need to be in a voice channel to play music!');
		} else {
			if (voiceChannel !== radio.voiceChannel) return msg.channel.send('You need to be in the same voice channel as RadioX to play music!');
		}
		if (!args[1]) return msg.channel.send('You need to use a number or search for a supported station!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel.');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in your voice channel.');
		}
		let station;
		const number = parseInt(args[1] - 1);
		if (url.startsWith('http')) {
			return;
		} else if (!isNaN(number)) {
			if (number > client.stations.length - 1) {
				return msg.channel.send('No such station!');
			} else {
				url = client.stations[number].stream[client.stations[number].stream.default];
				station = client.stations[number];
			}
		} else {
			if (args[1].length < 3) return msg.channel.send('Station must be over 2 characters!');
			const sstation = await searchStation(args.slice(1).join(' '), client);
			if (!sstation) return msg.channel.send('No stations found!');
			url = sstation.stream[sstation.stream.default];
			station = sstation
		}

		if (radio) {
			radio.connection.dispatcher.destroy();
			radio.station = station;
			play(msg.guild, client, url);
			return;
		}

		const construct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			playing: false,
			station: station,
			volume: client.config.volume,
			time: null
		};
		client.radio.set(msg.guild.id, construct);

		try {
			const connection = await voiceChannel.join();
			construct.connection = connection;
			play(msg.guild, client, url);
		} catch (error) {
			client.radio.delete(msg.guild.id);
			client.debug_channel.send("Error with connecting to voice channel: " + error);
			return msg.channel.send(`An error occured: ${error}`);
		}
	}
};
function play(guild, client, url) {

	const radio = client.radio.get(guild.id);

	const dispatcher = radio.connection
		.play(url, { bitrate: 1024, passes: 10, volume: 1, highWaterMark: 1 << 25 })
		.on("finish", () => {
			radio.voiceChannel.leave();
			client.radio.delete(guild.id);
			return;
		});

	dispatcher.on('start', () => {
		dispatcher.player.streamingData.pausedTime = 0;
	});

	dispatcher.on('error', error => {
		console.error(error);
		radio.voiceChannel.leave();
		client.radio.delete(guild.id);
		return radio.textChannel.send('An error has occured while playing radio!');
	});

	dispatcher.setVolume(radio.volume / 10);

	radio.textChannel.send(`Start playing: ${radio.station.name}`);
	radio.playing = true;

};

function searchStation(key, client) {
	if (client.stations === null) return false;
	let foundStations = [];
	if (!key) return false;
	if (key == 'radio') return false;
	if (key.startsWith("radio ")) key = key.slice(6);
	const probabilityIncrement = 100 / key.split(' ').length / 2;
	for (let i = 0; i < key.split(' ').length; i++) {
		client.stations.filter(x => x.name.toUpperCase().includes(key.split(' ')[i].toUpperCase()) || x === key).forEach(x => foundStations.push({ station: x, name: x.name, probability: probabilityIncrement }));
	}
	if (foundStations.length === 0) return false;
	for (let i = 0; i < foundStations.length; i++) {
		for (let j = 0; j < foundStations.length; j++) {
			if (foundStations[i] === foundStations[j] && i !== j) foundStations.splice(i, 1);
		}
	}
	for (let i = 0; i < foundStations.length; i++) {
		if (foundStations[i].name.length > key.length) {
			foundStations[i].probability -= (foundStations[i].name.split(' ').length - key.split(' ').length) * (probabilityIncrement * 0.5);
		} else if (foundStations[i].name.length === key.length) {
			foundStations[i].probability += (probabilityIncrement * 0.9);
		}

		for (let j = 0; j < key.split(' ').length; j++) {
			if (!foundStations[i].name.toUpperCase().includes(key.toUpperCase().split(' ')[j])) {
				foundStations[i].probability -= (probabilityIncrement * 0.5);
			}
		}
	}
	let highestProbabilityStation;
	for (let i = 0; i < foundStations.length; i++) {
		if (!highestProbabilityStation || highestProbabilityStation.probability < foundStations[i].probability) highestProbabilityStation = foundStations[i];
		if (highestProbabilityStation && highestProbabilityStation.probability === foundStations[i].probability) {
			highestProbabilityStation = foundStations[i].station;
		}
	}
	return highestProbabilityStation;
};
