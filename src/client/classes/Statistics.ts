import { Guild } from "discord.js";

export default class Statistics {
    map: any;

    constructor() {
        this.map = new Map();
    }

    update(client: any, guild: Guild, radio: any) {

        client.datastore.checkEntry(guild.id);

        radio.datastore = client.datastore.getEntry(guild.id);

        if(!radio.datastore.statistics[radio.station.name]){
            radio.datastore.statistics[radio.station.name] = {};
            radio.datastore.statistics[radio.station.name].time = 0;
            radio.datastore.statistics[radio.station.name].used = 0;
            client.datastore.updateEntry(guild, radio.datastore);
        }

        let date = new Date();
        radio.currentTime = date.getTime();
        radio.playTime = parseInt(radio.currentTime)-parseInt(radio.startTime);
        radio.datastore.statistics[radio.station.name].time = parseInt(radio.datastore.statistics[radio.station.name].time)+parseInt(radio.playTime);

        radio.datastore.statistics[radio.station.name].used = parseInt(radio.datastore.statistics[radio.station.name].used)+1;
        client.datastore.updateEntry(guild, radio.datastore);
        this.calculateGlobal(client);
    }

    calculateGlobal(client: any){
        if(!client.stations) return;
        if(!client.datastore.map) return;

        let guilds = client.datastore.map.keys();
        let stations = client.stations;
        let statistics : any = {};

        if(!client.stations) return;

        let calculation = guilds.next();

        while (!calculation.done) {
            let currentGuild = client.datastore.getEntry(calculation.value);
            if(calculation.value != 'global'){
                if(stations){
                    Object.keys(stations).forEach(function(station) {
                        if(currentGuild.statistics[stations[station].name] && currentGuild.statistics[stations[station].name].time && parseInt(currentGuild.statistics[stations[station].name].time) != 0  && currentGuild.statistics[stations[station].name].used && parseInt(currentGuild.statistics[stations[station].name].used) != 0){
                            if(!statistics[stations[station].name]){
                                statistics[stations[station].name] = {};
                                statistics[stations[station].name].time = 0;
                                statistics[stations[station].name].used = 0;
                            }

                            statistics[stations[station].name].time = parseInt(statistics[stations[station].name].time)+parseInt(currentGuild.statistics[stations[station].name].time);
                            statistics[stations[station].name].used = parseInt(statistics[stations[station].name].used)+parseInt(currentGuild.statistics[stations[station].name].used);
                        }
                    });
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
