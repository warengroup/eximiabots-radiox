module.exports = async function (guild, client, url) {

    const radio = client.radio.get(guild.id);
    const dispatcher = radio.connection
        .play(url, { bitrate: 1024, passes: 10, volume: 1, highWaterMark: 1 << 25 })
        .on("finish", () => {
            radio.voiceChannel.leave();
            radio.delete();
            return;
        });
    dispatcher.on('start', () => {
        dispatcher.player.streamingData.pausedTime = 0;
    });
    dispatcher.on('error', error => {
        console.error(error);
        client.channels.fetch(client.config.debug_channel).send('Error with the dispatcher: ' + error);
        radio.voiceChannel.leave();
        client.radio.delete(guild.id);
        return radio.textChannel.send('<:redx:674263474704220182> An error has occured while playing radio!');
    });
    dispatcher.setVolume(radio.volume / 10);
    radio.textChannel.send('Start playing');
    radio.playing = true;
}
