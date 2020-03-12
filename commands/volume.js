module.exports = {
	name: 'volume',
	description: 'Volume command.',
	alias: 'none',
	usage: '<volume>',
	permission: 'MANAGE_MESSAGES',
	category: 'music',
	execute(msg, args, client, Discord, prefix, command) {
		const radio = client.radio.get(msg.guild.id);
		if (!args[1] && radio) return msg.channel.send(`Current volume: **${radio.volume}**`);
		const volume = parseFloat(args[1]);
		if (client.funcs.check(client, msg, command)) {
			if (isNaN(volume)) return msg.channel.send('you need to enter a valid __number__.');
			if (volume > 100) return msg.channel.send('The max volume is `100`!');
			if (volume < 0) return msg.channel.send('The volume needs to be a positive number!');
			radio.volume = volume;
			radio.connection.dispatcher.setVolume(volume / 5);
			return msg.channel.send(`Volume is now: **${volume}**`);
		}
	}
};
