import { Guild, OAuth2Guild } from "discord.js";
import RadioClient from "../../Client";
import { radio } from "./Radio";

export interface statistics {
    [key: string]: statistic
}

interface statistic {
    "time": number,
    "used": number
}

export default class Statistics {
    map: Map<string, statistics>;

    constructor() {
        this.map = new Map();
    }

    update(client: RadioClient, guild: Guild | { id: string, name?: string } | undefined, radio: radio) {
        if(!guild) return;

        client.datastore?.checkEntry(guild.id);

        radio.datastore = client.datastore?.getEntry(guild.id);

        if(radio.datastore === undefined) return;

        if(!radio.datastore.statistics[radio.station.name]){
            radio.datastore.statistics[radio.station.name] = {
                time: 0,
                used: 0
            };
            client.datastore?.updateEntry(guild, radio.datastore);
        }

        let date = new Date();
        radio.currentTime = date.getTime();
        radio.playTime = radio.currentTime - radio.startTime;
        radio.datastore.statistics[radio.station.name] = {
            time: radio.datastore.statistics[radio.station.name].time + radio.playTime,
            used: radio.datastore.statistics[radio.station.name].used + 1
        }
        client.datastore?.updateEntry(guild, radio.datastore);
        this.calculateGlobal(client);
    }

    calculateGlobal(client: RadioClient){
        if(!client.datastore?.map) return;

        let guilds = client.datastore.map.keys();
        let statistics : statistics = {};

        if(!client.stations) return;

        let calculation = guilds.next();

        while (!calculation.done) {
            let currentGuild = client.datastore.getEntry(calculation.value);
            if(calculation.value != 'global'){
                if(client.stations){
                    for(const station of client.stations) {
                        if(!currentGuild) return;
                        if(currentGuild.statistics[station.name] && currentGuild.statistics[station.name]?.time && currentGuild.statistics[station.name].time != 0  && currentGuild.statistics[station.name].used && currentGuild.statistics[station.name].used != 0){
                            if(!statistics[station.name]){
                                statistics[station.name] = {
                                    time: 0,
                                    used: 0
                                };
                            }

                            statistics[station.name] = {
                                time: statistics[station.name].time + currentGuild.statistics[station.name].time,
                                used: statistics[station.name].used + currentGuild.statistics[station.name].used
                            }
                        }
                    }
                }
            }
            calculation = guilds.next();
        }

        let newData = {
            guild: {
                id: "global",
                name: "global"
            },
            statistics: statistics,
            state: null
        };
        client.datastore.updateEntry(newData.guild, newData);
    }

};
