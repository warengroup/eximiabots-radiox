import { Guild } from "discord.js";
import RadioClient from "../../Client";
import { radio } from "./Radio";

export default class Statistics {
    map: Map<any, any>;

    constructor() {
        this.map = new Map();
    }

    update(client: RadioClient, guild: Guild | null, radio: radio) {
        if(!guild) return;

        client.datastore?.checkEntry(guild.id);

        radio.datastore = client.datastore?.getEntry(guild.id);

        if(!radio.datastore.statistics[radio.station.name]){
            radio.datastore.statistics[radio.station.name] = {};
            radio.datastore.statistics[radio.station.name].time = 0;
            radio.datastore.statistics[radio.station.name].used = 0;
            client.datastore?.updateEntry(guild, radio.datastore);
        }

        let date = new Date();
        radio.currentTime = date.getTime();
        radio.playTime = radio.currentTime - radio.startTime;
        radio.datastore.statistics[radio.station.name].time = parseInt(radio.datastore.statistics[radio.station.name].time) + radio.playTime;

        radio.datastore.statistics[radio.station.name].used = parseInt(radio.datastore.statistics[radio.station.name].used)+1;
        client.datastore?.updateEntry(guild, radio.datastore);
        this.calculateGlobal(client);
    }

    calculateGlobal(client: RadioClient){
        if(!client.stations) return;
        if(!client.datastore?.map) return;

        let guilds = client.datastore.map.keys();
        let stations = client.stations;
        let statistics : any = {};

        if(!client.stations) return;

        let calculation = guilds.next();

        while (!calculation.done) {
            let currentGuild = client.datastore.getEntry(calculation.value);
            if(calculation.value != 'global'){
                if(stations){
                    for(const station of stations) {
                        if(currentGuild.statistics[station.name] && currentGuild.statistics[station.name].time && parseInt(currentGuild.statistics[station.name].time) != 0  && currentGuild.statistics[station.name].used && parseInt(currentGuild.statistics[station.name].used) != 0){
                            if(!statistics[station.name]){
                                statistics[station.name] = {};
                                statistics[station.name].time = 0;
                                statistics[station.name].used = 0;
                            }

                            statistics[station.name].time = parseInt(statistics[station.name].time)+parseInt(currentGuild.statistics[station.name].time);
                            statistics[station.name].used = parseInt(statistics[station.name].used)+parseInt(currentGuild.statistics[station.name].used);
                        }
                    }
                }
            }
            calculation = guilds.next();
        }

        let newData : any = {};
        newData.guild = {};
        newData.guild.id = "global";
        newData.guild.name = "global";
        newData.statistics = statistics;
        client.datastore.updateEntry(newData.guild, newData);
    }

};
