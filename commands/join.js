module.exports = {
    name: 'join',
    alias: 'j',
    usage: '',
    description: 'Make Musix join the channel your channel',
    onlyDev: true,
    permission: 'none',
    category: 'util',
    async execute(msg, args, client, Discord, prefix) {
        try {
            const radio = client.radio.get(msg.guild.id);
            const voiceChannel = msg.member.voice.channel;
            const connection = await voiceChannel.join();
            if (radio) {
                radio.connection = connection;
            }
            msg.channel.send(`<:green_check_mark:674265384777416705> Joined ${voiceChannel.name}!`);
        } catch (error) {
            client.radio.delete(msg.guild.id);
            client.channels.fetch(client.config.debug_channel).send("Error with connecting to voice channel: " + error);
            return msg.channel.send(`<:redx:674263474704220182> An error occured: ${error}`);
        }
    }
};