module.exports = {
	name: 'stop',
	description: 'Stop command.',
	alias: 'none',
	usage: '',
	permission: 'none',
	category: 'music',
	execute(msg, args, client, Discord, prefix, command) {
		const radio = client.radio.get(msg.guild.id);
		radio.connection.dispatcher.end();
		msg.channel.send('<:stop:674685626108477519> Stopped the music!');
	}
};