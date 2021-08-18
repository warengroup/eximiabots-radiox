const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'stop',
	description: 'Stop radio.',
	alias: 's',
	usage: '',
	permission: 'none',
	category: 'radio',
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop radio.'),
	execute(interaction, client, Discord, command) {
		const radio = client.radio.get(interaction.guild.id);
		if (client.funcs.check(client, interaction, command)) {
            client.funcs.statisticsUpdate(client, interaction.guild, radio);
			radio.connection?.destroy();
			radio.audioPlayer?.stop();
			client.radio.delete(interaction.guild.id);
			interaction.reply(client.messageEmojis["stop"] + client.messages.stop);
		}
	}
};