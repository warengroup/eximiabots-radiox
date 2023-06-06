import logger from "../funcs/logger";
import { createAudioPlayer, createAudioResource, NoSubscriberBehavior } from "@discordjs/voice";
import RadioClient from "../../Client";
import { station } from "./Stations";

export default class Streamer {
    map: any;
    mode: any | null;
    logger: any;

    constructor() {
        this.map = new Map();
        this.mode = null;
    }

    init(client: RadioClient){
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

            client.stations.forEach((station: station) => {
                this.play(station);
            });
        }
    }

    refresh(client: RadioClient){
        this.init(client);

        let streamers = this.map.keys();
        streamers.forEach((streamer: any) => {
            if(client.stations?.findIndex((station: station) => station.name == streamer) == -1){
                this.stop(streamer);
            }
        });
    }

    play(station: station) {
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
	            logger('Streamer', station.name + " / " + "Playing");
            })
            .on('idle', () => {
                logger('Streamer', station.name + " / " + "Idle");
                audioPlayer.removeAllListeners();
                if(this.mode == "manual" && audioPlayer.subscribers.length == 0) return;
                this.play(station);
            })
            .on('paused', () => {
                logger('Streamer', station.name + " / " + "Paused");
            })
            .on('buffering', () => {
                logger('Streamer', station.name + " / " + "Buffering");
            })
            .on('autopaused', () => {
                logger('Streamer', station.name + " / " + "AutoPaused");
            })
            .on('error', (error: string) => {
                logger('Streamer', station.name + " / " + "Error" + "\n" + error);
            });
        return audioPlayer;
    }

    stop(station: station){
        let audioPlayer = this.map.get(station.name);
        if(audioPlayer){
            logger('Streamer', station.name + " / " + "Stop");
            audioPlayer.removeAllListeners();
            audioPlayer.stop();
        }
        this.map.delete(station.name);
    }

    listen(station: station) {
        let audioPlayer = this.map.get(station.name);
        if(!audioPlayer || this.mode == "manual" && audioPlayer.subscribers.length == 0) audioPlayer = this.play(station);
        return audioPlayer;
    }

    leave(client: RadioClient) {
        if(!client.stations) return;
        client.stations.forEach((station: station) => {
            this.stop(station);
        });
    }
};
