module.exports = {
    name: 'ready',
    async execute(client, Discord) {
        if (client.config.devMode) {
            console.log('dev mode');
        }
        client.user.setActivity(`@${client.user.username} help | 🎶`, { type: 'LISTENING' });
        client.user.setStatus('online');
        console.log('- Activated -');
        setInterval(() => {
            client.funcs.ffmpeg(client, Discord);
        }, 7200000);
    }
}
