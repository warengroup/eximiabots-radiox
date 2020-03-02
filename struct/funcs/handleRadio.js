module.exports = async function (msg, voiceChannel, client, url) {
    const radio = client.radio.get(msg.guild.id);

    if (radio) {
        radio.connection.dispatcher.end('Stopped');
    }

    const construct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        playing: false,
        url: url,
        name: null,
        volume: client.config.volume,
    };
    client.radio.set(msg.guild.id, construct);

    try {
        const connection = await voiceChannel.join();
        construct.connection = connection;
        client.funcs.play(msg.guild, client, url);
    } catch (error) {
        client.radio.delete(msg.guild.id);
        //client.channels.fetch(client.config.debug_channel).send("Error with connecting to voice channel: " + error);
        return msg.channel.send(`<:redx:674263474704220182> An error occured: ${error}`);
    }
    return;
}
