import { Guild } from "discord.js";
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

    update(client: RadioClient, guild: Guild | null, radio: radio) {
        if(!guild) return;

        client.datastore?.checkEntry(guild.id);

        radio.datastore = client.datastore?.getEntry(guild.id);

        //@ts-ignore
        if(!radio.datastore.statistics[radio.station.name]){
            //@ts-ignore
            radio.datastore.statistics[radio.station.name] = {
                time: 0,
                used: 0
            };
            //@ts-ignore
            client.datastore?.updateEntry(guild, radio.datastore);
        }

        let date = new Date();
        radio.currentTime = date.getTime();
        radio.playTime = radio.currentTime - radio.startTime;
        //@ts-ignore
        radio.datastore.statistics[radio.station.name].time = parseInt(radio.datastore.statistics[radio.station.name].time) + radio.playTime;

        //@ts-ignore
        radio.datastore.statistics[radio.station.name].used = parseInt(radio.datastore.statistics[radio.station.name].used)+1;
        //@ts-ignore
        client.datastore?.updateEntry(guild, radio.datastore);
        this.calculateGlobal(client);
    }

    calculateGlobal(client: RadioClient){
        if(!client.stations) return;
        if(!client.datastore?.map) return;

        let guilds = client.datastore.map.keys();
        let stations = client.stations;
        let statistics : statistics = {};

        if(!client.stations) return;

        let calculation = guilds.next();

        while (!calculation.done) {
            let currentGuild = client.datastore.getEntry(calculation.value);
            if(calculation.value != 'global'){
                if(stations){
                    for(const station of stations) {
                        //@ts-ignore
                        if(currentGuild.statistics[station.name] && currentGuild.statistics[station.name]?.time && parseInt(currentGuild.statistics[station.name].time) != 0  && currentGuild.statistics[station.name].used && parseInt(currentGuild.statistics[station.name].used) != 0){
                            if(!statistics[station.name]){
                                statistics[station.name] = {
                                    time: 0,
                                    used: 0
                                };
                            }

                            //@ts-ignore
                            statistics[station.name].time = parseInt(statistics[station.name].time)+parseInt(currentGuild.statistics[station.name].time);
                            //@ts-ignore
                            statistics[station.name].used = parseInt(statistics[station.name].used)+parseInt(currentGuild.statistics[station.name].used);
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
            statistics: statistics
        };
        client.datastore.updateEntry(newData.guild, newData);
    }

};
