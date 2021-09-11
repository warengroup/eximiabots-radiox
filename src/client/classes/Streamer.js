const {
    createAudioPlayer,
    createAudioResource
} = require("@discordjs/voice");
const {
    logger
} = require("../funcs/logger.js");

module.exports = class {
    constructor() {
        this.map = new Map();
        this.stations = null;
    }

    init(client){
        if(!client.stations) return;

        client.stations.forEach(station => {
            this.play(station);
        });
    }

    play(station) {
        const url = station.stream[station.stream.default];
        const audioPlayer = createAudioPlayer();
        const resource = createAudioResource(url);
        audioPlayer.play(resource);
        resource.playStream
            .on("readable", () => {
                logger('Streamer', station.name + " / " + "Readable");
                this.map.set(station.name, audioPlayer);
            })
            .on("finish", () => {
                logger('Streamer', station.name + " / " + "Finished");
                this.map.delete(station.name);
            })
            .on("error", error => {
                logger('Streamer', station.name + " / " + "Error");
                this.map.delete(station.name);
            });
        return audioPlayer;
    }

    listen(station) {
        let audioPlayer = this.map.get(station.name);
        if(!audioPlayer){
            audioPlayer = this.play(station);
        }
        return audioPlayer;
    }

    leave(client) {
        if(!client.stations) return;

        client.stations.forEach(station => {
            let streamer = this.map.get(station.name);
            streamer?.stop();
            this.map.delete(station.name);
        });
    }
};
