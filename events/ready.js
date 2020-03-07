module.exports = {
    name: 'ready',
    async execute(client, Discord) {
        const debugChannel = await client.channels.fetch(client.config.debug_channel);
        client.debug_channel = debugChannel
        if (client.config.devMode) {
            console.log('dev mode');
        }
        console.log('- Activated -');
    }
}
