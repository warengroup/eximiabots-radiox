module.exports = {
    name: 'ready',
    async execute(client, Discord) {
        const fetch = require('node-fetch');
        
        console.log('RadioX');
        console.log('We will bring you finnish radio to your discord server');
        console.log('(c)2020 EximiaBots by Warén Media / Christer Warén & MatteZ02');
        
        client.stations = await fetch('https://gitea.cwinfo.org/cwchristerw/radio/raw/branch/master/playlist.json')
            .then(res => res.json());
            
        setInterval(async () => {
            client.stations = await fetch('https://gitea.cwinfo.org/cwchristerw/radio/raw/branch/master/playlist.json')
                .then(res => res.json());
        }, 3600);
    }
}