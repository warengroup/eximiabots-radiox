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
			radio.connection.dispatcher.destroy();
			radio.voiceChannel.leave();
			client.radio.delete(msg.guild.id);
			msg.channel.send(client.messageEmojis["stop"] + client.messages.stop);
		}
	}
};