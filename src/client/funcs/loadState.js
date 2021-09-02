module.exports = function loadState(client, guild){
    let data = client.datastore.getEntry(guild.id);
    if(!data) return;
    let state;

    state = data.state;
    data.state = {};
    client.datastore.updateEntry(guild, data);
    return state;
}