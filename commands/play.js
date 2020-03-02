module.exports = {
	name: 'play',
	alias: 'p',
	usage: '<song name>',
	description: 'Play some music.',
	onlyDev: false,
	permission: 'none',
	category: 'music',
	async execute(msg, args, client, Discord, prefix) {
		const searchString = args.slice(1).join(" ");
		const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
		const radio = client.radio.get(msg.guild.id);
		const voiceChannel = msg.member.voice.channel;
		if (!radio) {
			if (!msg.member.voice.channel) return msg.channel.send('<:redx:674263474704220182> I\'m sorry but you need to be in a voice channel to play music!');
		} else {
			if (voiceChannel !== radio.voiceChannel) return msg.channel.send('<:redx:674263474704220182> I\'m sorry but you need to be in the same voice channel as Musix to play music!');
		}
		if (!args[1]) return msg.channel.send('<:redx:674263474704220182> You need to use a link or search for a song!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('<:redx:674263474704220182> I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('<:redx:674263474704220182> I cannot speak in your voice channel, make sure I have the proper permissions!');
		}
		return client.funcs.handleRadio(msg, voiceChannel, client, url);
	}
};
