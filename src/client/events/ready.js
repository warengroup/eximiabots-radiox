const fetch = require('node-fetch');

module.exports = {
    name: 'ready',
    async execute(client) {

        console.log('RadioX ' + client.config.version);
        console.log('Internet Radio to your Discord guild');
        console.log('(c)2020-2021 EximiaBots by Warén Group');
        console.log('');

        /*DEVELOPERS*/
        client.funcs.logger('Developers', 'List');
        
        client.developers = "";
        let user = "";
        for (let i = 0; i < client.config.devId.length; i++) {
            user = await client.users.fetch(client.config.devId[i]);
            console.log("   - " + user.tag);
            if (i == client.config.devId.length - 1) {
                client.developers += user.tag;
            } else {
                client.developers += user.tag + " & ";
            }
        }
        console.log("\n");

        /*STATIONS*/
        try {
            client.funcs.logger('Stations', 'Started fetching list – ' + client.config.stationslistUrl);
            client.stations = await fetch(client.config.stationslistUrl)
                .then(client.funcs.checkFetchStatus)
                .then(response => response.json());

            client.funcs.logger('Stations', 'List');
            client.stations.forEach(station => {
                console.log("   - " + station.name);
            });
            console.log("\n");

            client.funcs.logger('Stations', 'Successfully fetched list');
        } catch (error) {
            client.funcs.logger('Stations', 'Fetching list failed');
            console.error(error + "\n");
        }
        
        setInterval(async () => {
            try {
                client.funcs.logger('Stations', 'Started fetching list – ' + client.config.stationslistUrl);
                client.stations = await fetch(client.config.stationslistUrl)
                    .then(client.funcs.checkFetchStatus)
                    .then(response => response.json());

                client.funcs.logger('Stations', 'Successfully fetched list');
            } catch (error) {
                client.funcs.logger('Stations', 'Fetching list failed');
                //console.error(error);
            }
        }, 3600000);

        if(!client.stations) {
            client.user.setStatus('dnd');
        }
        
        /*GUILDS*/
        client.funcs.logger('Guilds', 'Started fetching list');

        client.funcs.logger('Guilds', 'List');
        let guilds = await client.guilds.fetch();
        guilds.forEach(guild => {
            console.log("   - " + guild.id + ": " + guild.name);
        });
        console.log("\n");

        client.funcs.logger('Guilds', 'Successfully fetched list');

        /*STATISTICS*/
        client.datastore.calculateGlobal(client);

        /*EMOJIS*/
        require(`../emojis.js`).execute(client);

        /*COMMANDS*/
        require(`../commands.js`).execute(client);

    }
}