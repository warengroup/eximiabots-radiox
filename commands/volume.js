module.exports = {
	name: 'volume',
	description: 'Volume command.',
	alias: 'none',
	usage: '<volume>',
	permission: 'MANAGE_MESSAGES',
	category: 'music',
	execute(msg, args, client, Discord, prefix, command) {
        let message = {};
		const radio = client.radio.get(msg.guild.id);
        
		if (!args[1] && radio) {
            message.currentVolume = client.messages.currentVolume.replace("%radio.volume%", radio.volume)
            return msg.channel.send(message.currentVolume);
        }
		const volume = parseFloat(args[1]);
		if (client.funcs.check(client, msg, command)) {
			if (isNaN(volume)) return msg.channel.send(client.messages.invalidVolume);
			if (volume > 100) return msg.channel.send(client.messages.maxVolume);
			if (volume < 0) return msg.channel.send(client.messages.negativeVolume);
			radio.volume = volume;
			radio.connection.dispatcher.setVolume(volume / 5);
            message.newVolume = client.messages.newVolume.replace("%volume%", volume);
			return msg.channel.send(message.newVolume);
		}
	}
};