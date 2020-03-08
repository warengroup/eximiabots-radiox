module.exports = async function (guild, client, station) {

    const radio = client.radio.get(guild.id);
    const stations = await client.funcs.radiostations();
    let url = "";
    
    if(isNaN(station)){
        radio.voiceChannel.leave();
        return radio.textChannel.send('<:redx:674263474704220182> An error has occured while playing radio!');
    }

    if(station-1 > stations.length-1){
        radio.voiceChannel.leave();
        return radio.textChannel.send('<:redx:674263474704220182> An error has occured while playing radio!');
    }

    url = stations[station-1].stream[stations[station-1].stream.default];
    
    if(!url) {
        radio.voiceChannel.leave();
        return radio.textChannel.send('<:redx:674263474704220182> An error has occured while playing radio!');
    }

    const dispatcher = radio.connection
        .play(url, { bitrate: 1024, passes: 10, volume: 1, highWaterMark: 1 << 25 })
        .on("finish", () => {
            radio.voiceChannel.leave();
            client.radio.delete(guild.id);
            return;
        });

    dispatcher.on('start', () => {
        dispatcher.player.streamingData.pausedTime = 0;
    });
        
    dispatcher.on('error', error => {
        console.error(error);
        radio.voiceChannel.leave();
        client.radio.delete(guild.id);
        return radio.textChannel.send('<:redx:674263474704220182> An error has occured while playing radio!');
    });
        
    dispatcher.setVolume(radio.volume / 10);
    
    radio.textChannel.send('Start playing');
    radio.playing = true;

}
