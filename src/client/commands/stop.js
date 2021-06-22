module.exports = {
	name: 'stop',
	description: 'Stop command.',
	alias: 's',
	usage: '',
	permission: 'none',
	category: 'radio',
	execute(msg, args, client, Discord, command) {
		const radio = client.radio.get(msg.guild.id);
		if (client.funcs.check(client, msg, command)) {
            client.funcs.statisticsUpdate(client, msg.guild, radio);
			radio.connection.destroy();
			radio.voiceChannel.leave();
			client.radio.delete(msg.guild.id);
			msg.channel.send(client.messageEmojis["stop"] + client.messages.stop);
		}
	}
};