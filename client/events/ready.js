const fetch = require('node-fetch');

module.exports = {
    name: 'ready',
    async execute(client, Discord) {

        console.log('RadioX');
        console.log('We will bring you finnish radio to your discord server');
        console.log('(c)2020 EximiaBots by Warén Media / Christer Warén & MatteZ02');

        client.developers = "";
        let user = "";
        for (i = 0; i < client.config.devId.length; i++) {
            user = await client.users.fetch(client.config.devId[i]);
            if (i == client.config.devId.length - 1) {
                client.developers += user.tag;
            } else {
                client.developers += user.tag + " & ";
            }
        }

        try {
            client.stations = await fetch('https://gitea.cwinfo.org/cwchristerw/radio/raw/branch/master/playlist.json')
                .then(client.funcs.checkFetchStatus)
                .then(response => response.json());
        } catch (error) {
            console.error(error);
        }
        
        setInterval(async () => {
            try {
                client.stations = await fetch('https://gitea.cwinfo.org/cwchristerw/radio/raw/branch/master/playlist.json')
                    .then(client.funcs.checkFetchStatus)
                    .then(response => response.json());
            } catch (error) {
                console.error(error);
            }
        }, 3600000);

        if(!client.stations) {
            client.user.setStatus('dnd');
        }
        
        client.datastore.calculateGlobal(client);
        require(`../emojis.js`).execute(client);

    }
}