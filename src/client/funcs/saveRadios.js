module.exports =  async function saveRadios(client) {
    let currentRadios = client.radio.keys();
    let radio = currentRadios.next();
    
    while (!radio.done) {
        let currentRadio = client.radio.get(radio.value);
        currentRadio.guild = client.datastore.getEntry(radio.value).guild;
    
        if (currentRadio) {
            await client.funcs.statisticsUpdate(client, currentRadio.guild, currentRadio);
            await client.funcs.saveState(client, currentRadio.guild, currentRadio);
            currentRadio.connection?.destroy();
            currentRadio.audioPlayer?.stop();
            currentRadio.message?.delete();
            client.radio.delete(radio.value);
        }
        
        radio = currentRadios.next();
    }
}