module.exports = function statisticsUpdate(client, guild, radio) {
    
    client.datastore.checkEntry(guild.id);
    
    radio.currentGuild = client.datastore.getEntry(guild.id);
    
    if(!radio.currentGuild.statistics[radio.station.name]){
        radio.currentGuild.statistics[radio.station.name] = {};
        radio.currentGuild.statistics[radio.station.name].time = 0;
        radio.currentGuild.statistics[radio.station.name].used = 0;
        client.datastore.updateEntry(guild, radio.currentGuild);
    }
    
    let date = new Date();
    radio.currentTime = date.getTime();
    radio.playTime = parseInt(radio.currentTime)-parseInt(radio.startTime);
    radio.currentGuild.statistics[radio.station.name].time = parseInt(radio.currentGuild.statistics[radio.station.name].time)+parseInt(radio.playTime);
    
    radio.currentGuild.statistics[radio.station.name].used = parseInt(radio.currentGuild.statistics[radio.station.name].used)+1;
    client.datastore.updateEntry(guild, radio.currentGuild);
    client.datastore.calculateGlobal(client);
}