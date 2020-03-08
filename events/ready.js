module.exports = {
    name: 'ready',
    async execute(client, Discord) {
        if (client.config.devMode) {
            console.log('dev mode');
        }
        console.log('- Activated -');
    }
}
