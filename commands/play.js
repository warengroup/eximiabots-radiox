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
			if (!msg.member.voice.channel) return msg.channel.send(client.messageEmojis["x"] + client.messages.noVoiceChannel);
		} else {
			if (voiceChannel !== radio.voiceChannel) return msg.channel.send(client.messageEmojis["x"] + client.messages.wrongVoiceChannel);
		}
		if (!args[1]) return msg.channel.send(client.messages.noQuery);
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send(client.messageEmojis["x"] + client.messages.noPermsConnect);
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send(client.messageEmojis["x"] + client.messages.noPermsSpeak);
		}
		let station;
		const number = parseInt(args[1] - 1);
		if (url.startsWith('http')) {
			return;
		} else if (!isNaN(number)) {
			if (number > client.stations.length - 1) {
				return msg.channel.send(client.messageEmojis["x"] + client.messages.wrongStationNumber);
			} else {
				url = client.stations[number].stream[client.stations[number].stream.default];
				station = client.stations[number];
			}
		} else {
			if (args[1].length < 3) return msg.channel.send(client.messageEmojis["x"] + client.messages.tooShortSearch);
			const sstation = await searchStation(args.slice(1).join(' '), client);
			if (!sstation) return msg.channel.send(client.messageEmojis["x"] + client.messages.noSearchResults);
			url = sstation.stream[sstation.stream.default];
			station = sstation
		}

		if (radio) {
			radio.connection.dispatcher.destroy();
			radio.station = station;
            radio.textChannel = msg.channel;
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
			return msg.channel.send(client.messageEmojis["x"] + `An error occured: ${error}`);
		}
	}
};
function play(guild, client, url) {
    let message = {};
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
		return radio.textChannel.send(client.messages.errorPlaying);
	});

	dispatcher.setVolume(radio.volume / 10);

    message.play = client.messages.play.replace("%radio.station.name%", radio.station.name);
	radio.textChannel.send(client.messageEmojis["play"] + message.play);
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
