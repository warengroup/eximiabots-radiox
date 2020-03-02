module.exports = async function (client, reason, guild) {
    const radio = client.radio.get(guild.id);
    radio.playing = false;
    if (reason === "Stream is not generating quickly enough.") {
        console.log("Song ended");
    } else if (reason === "seek") {
        return;
    } else {
        console.log(reason);
    }
    if (!radio.songLooping) {
        if (radio.looping) {
            radio.songs.push(radio.songs[0]);
        }
        radio.votes = 0;
        radio.voters = [];
        radio.songs.shift();
    }
    client.funcs.play(guild, radio.songs[0], client, 0, true);
};