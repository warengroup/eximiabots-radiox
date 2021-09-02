module.exports = function statisticsUpdate(client, guild, radio) {
    
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
    client.datastore.calculateGlobal(client);
}