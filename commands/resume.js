module.exports = {
	name: 'resume',
	alias: 'none',
	usage: '',
	description: 'Resume the paused music.',
	onlyDev: false,
	permission: 'MANAGE_MESSAGES',
	category: 'music',
	execute(msg, args, client, Discord, prefix, command) {
		const radio = client.radio.get(msg.guild.id);
		if (client.funcs.check(client, msg, command)) {
			if (!radio.paused) return msg.channel.send('<:redx:674263474704220182> The music in not paused!');
			radio.paused = false;
			radio.connection.dispatcher.resume(true);
			return msg.channel.send('<:resume:674685585478254603> Resumed the music!');
		}
	}
};
