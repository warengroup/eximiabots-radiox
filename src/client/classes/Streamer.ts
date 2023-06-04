const {
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    NoSubscriberBehavior
} = require("@discordjs/voice");

export default class Streamer {
    constructor() {
        this.map = new Map();
        this.mode = null;
        this.logger = require("../funcs/logger");
    }

    init(client){
        if(!client.config.streamerMode) return;

        switch(client.config.streamerMode){
            case "manual":
                this.mode = "manual";
                break;
            case "auto":
                this.mode = "auto";
                break;
            default:
                this.mode = "manual";
        }

        if(this.mode == "auto"){
            if(!client.stations) return;

            client.stations.forEach(station => {
                this.play(station);
            });
        }
    }

    refresh(client){
        this.init(client);

        let streamers = this.map.keys();
        streamers.forEach(streamer => {
            if(client.stations.findIndex(station => station.name == streamer) == -1){
                this.stop(streamer);
            }
        });
    }

    play(station) {
        let audioPlayer = this.map.get(station.name);
        if(!audioPlayer) {
            if(this.mode == "auto"){
                audioPlayer = createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Play,
                        maxMissedFrames: Math.round(5000 / 20),
                    },
                });
            }
            if(this.mode == "manual"){
                audioPlayer = createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Stop,
                        maxMissedFrames: Math.round(5000 / 20),
                    },
                });
            }
            this.map.set(station.name, audioPlayer);
        }
        const url = station.stream[station.stream.default];
        const resource = createAudioResource(url);
        audioPlayer.play(resource);
        audioPlayer
            .on('playing', () => {
	            this.logger('Streamer', station.name + " / " + "Playing");
            })
            .on('idle', () => {
                this.logger('Streamer', station.name + " / " + "Idle");
                audioPlayer.removeAllListeners();
                if(this.mode == "manual" && audioPlayer.subscribers.length == 0) return;
                this.play(station);
            })
            .on('paused', () => {
                this.logger('Streamer', station.name + " / " + "Paused");
            })
            .on('buffering', () => {
                this.logger('Streamer', station.name + " / " + "Buffering");
            })
            .on('autopaused', () => {
                this.logger('Streamer', station.name + " / " + "AutoPaused");
            })
            .on('error', error => {
                this.logger('Streamer', station.name + " / " + "Error" + "\n" + error);
            });
        return audioPlayer;
    }

    stop(station){
        let audioPlayer = this.map.get(station.name);
        if(audioPlayer){
            this.logger('Streamer', station.name + " / " + "Stop");
            audioPlayer.removeAllListeners();
            audioPlayer.stop();
        }
        this.map.delete(station.name);
    }

    listen(station) {
        let audioPlayer = this.map.get(station.name);
        if(!audioPlayer || this.mode == "manual" && audioPlayer.subscribers.length == 0) audioPlayer = this.play(station);
        return audioPlayer;
    }

    leave(client) {
        if(!client.stations) return;
        client.stations.forEach(station => {
            this.stop(station);
        });
    }
};
