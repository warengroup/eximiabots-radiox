const {
    createAudioPlayer,
    createAudioResource
} = require("@discordjs/voice");

module.exports = class {
    constructor() {
        this.map = new Map();
        this.stations = null;
        this.logger = require("../funcs/logger.js");
    }

    init(client){
        if(!client.stations) return;

        client.stations.forEach(station => {
            let audioPlayer = this.map.get(station.name);
            if(!audioPlayer) {
                audioPlayer = createAudioPlayer();
                this.map.set(station.name, audioPlayer);
            }
            this.play(station);
        });
    }

    refresh(client){
        this.init(client);

        let streamers = this.map.keys();
        streamers.forEach(streamer => {
            if(client.stations.findIndex(station => station.name == streamer)) return;
            this.stop(streamer);
        });
    }

    play(station) {
        const audioPlayer = this.map.get(station.name);
        const url = station.stream[station.stream.default];
        const resource = createAudioResource(url);
        audioPlayer.play(resource);
        resource.playStream
            .on("readable", () => {
                this.logger('Streamer', station.name + " / " + "Readable");
                this.map.set(station.name, audioPlayer);
            })
            .on("finish", () => {
                this.logger('Streamer', station.name + " / " + "Finished");
                this.map.delete(station.name);
                this.play(station);
            })
            .on("error", error => {
                this.logger('Streamer', station.name + " / " + "Error");
                this.map.delete(station.name);
                this.play(station);
            });
        return audioPlayer;
    }

    stop(station){
        let audioPlayer = this.map.get(station.name);
        audioPlayer?.stop();
        this.map.delete(station.name);
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
            this.stop(station);
        });
    }
};
