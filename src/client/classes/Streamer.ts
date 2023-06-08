import logger from "../funcs/logger";
import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, NoSubscriberBehavior } from "@discordjs/voice";
import RadioClient from "../../Client";
import { station } from "./Stations";

export default class Streamer {
    map: Map<string, AudioPlayer>;
    mode: "auto" | "manual";

    constructor() {
        this.map = new Map();
        this.mode = "manual";
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

            for(const station of client.stations){
                this.play(station);
            }
        }
    }

    refresh(client: RadioClient){
        this.init(client);

        for (const streamer of this.map.keys()){
            if(client.stations?.findIndex((station: station) => station.name == streamer) == -1){
                this.stop(streamer);
            }
        }
    }

    play(station: station) {
        let audioPlayer = this.map.get(station.name);
        if(!audioPlayer) {
            if(this.mode == "auto"){
                audioPlayer = createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Play,
                        maxMissedFrames: Math.round(5000 / 20),
                    }
                });
            } else {
                audioPlayer = createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Stop,
                        maxMissedFrames: Math.round(5000 / 20),
                    }
                });
            }

            audioPlayer
                .on(AudioPlayerStatus.Playing, () => {
                    logger('Streamer', station.name + " / " + "Playing");
                })
                .on(AudioPlayerStatus.Idle, () => {
                    logger('Streamer', station.name + " / " + "Idle");
                })
                .on(AudioPlayerStatus.Paused, () => {
                    logger('Streamer', station.name + " / " + "Paused");
                })
                .on(AudioPlayerStatus.Buffering, () => {
                    logger('Streamer', station.name + " / " + "Buffering");
                })
                .on(AudioPlayerStatus.AutoPaused, () => {
                    logger('Streamer', station.name + " / " + "AutoPaused");
                })

            this.map.set(station.name, audioPlayer);
        }

        const url = station.stream[station.stream.default];
        const resource = createAudioResource(url);
        audioPlayer.play(resource);

        return audioPlayer;
    }

    stop(streamer: string){
        let audioPlayer = this.map.get(streamer);
        if(audioPlayer){
            logger('Streamer', streamer + " / " + "Stop");
            audioPlayer.removeAllListeners();
            audioPlayer.stop();
        }
        this.map.delete(streamer);
    }

    listen(station: station) {
        let audioPlayer = this.map.get(station.name);
        if(!audioPlayer) audioPlayer = this.play(station);
        return audioPlayer;
    }

    leave(client: RadioClient) {
        if(!client.stations) return;
        for(const station of client.stations){
            this.stop(station.name);
        }
    }
};
