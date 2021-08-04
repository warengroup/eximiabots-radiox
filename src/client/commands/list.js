module.exports = {
    name: 'list',
    alias: 'l',
    usage: '',
    description: 'List radio stations.',
    permission: 'none',
    category: 'radio',
    execute(msg, args, client, Discord, command) {
        let message = {};
		if(!client.stations) {
			message.errorToGetPlaylist = client.messages.errorToGetPlaylist.replace("%client.config.supportGuild%", client.config.supportGuild);
			return msg.channel.send(client.messageEmojis["error"] + message.errorToGetPlaylist);
		}
        let stations = `${client.stations.map(s => `**#** ${s.name}`).join('\n')}`
        const hashs = stations.split('**#**').length;
        for (let i = 0; i < hashs; i++) {
            stations = stations.replace('**#**', `**${i + 1}**`);
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(client.messages.listTitle)
            .setThumbnail("https://cdn.discordapp.com/emojis/" + client.messageEmojis["list"].replace(/[^0-9]+/g, ''))
            .setColor(client.config.embedColor)
            .setDescription(stations)
            .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
        return msg.channel.send({ embeds: [embed] });
    }
};