const fetch = require('node-fetch');

module.exports = {
    name: 'ready',
    async execute(client, Discord) {

        console.log('RadioX ' + client.config.version);
        console.log('Internet Radio to your Discord guild');
        console.log('(c)2020-2021 EximiaBots by Warén Group');
        console.log('');

        client.developers = "";
        let user = "";
        for (let i = 0; i < client.config.devId.length; i++) {
            user = await client.users.fetch(client.config.devId[i]);
            if (i == client.config.devId.length - 1) {
                client.developers += user.tag;
            } else {
                client.developers += user.tag + " & ";
            }
        }

        try {
            client.funcs.logger('Stations', 'Started fetching list – ' + client.config.stationslistUrl);
            client.stations = await fetch(client.config.stationslistUrl)
                .then(client.funcs.checkFetchStatus)
                .then(response => response.json());
            client.funcs.logger('Stations', 'Successfully fetched list' + "\n");
        } catch (error) {
            client.funcs.logger('Stations', ' Fetching list failed');
            console.error(error + "\n");
        }
        
        setInterval(async () => {
            try {
                client.funcs.logger('Stations' + 'Started fetching list – ' + client.config.stationslistUrl);
                client.stations = await fetch(client.config.stationslistUrl)
                    .then(client.funcs.checkFetchStatus)
                    .then(response => response.json());
                console.log('Stations', 'Successfully fetched list' + "\n");
            } catch (error) {
                client.funcs.logger('Stations', 'Fetching list failed');
                //console.error(error);
            }
        }, 3600000);

        if(!client.stations) {
            client.user.setStatus('dnd');
        }
        
        client.datastore.calculateGlobal(client);
        require(`../emojis.js`).execute(client);

        require(`../commands.js`).execute(client);

    }
}