module.exports = {
    name: 'voiceStateUpdate',
    async execute(client, newMember) {
        const serverQueue = client.radio.get(newMember.guild.id);
        if (!serverQueue) return;
        if (newMember === client.user) {
            if (newMember.voice.channel !== serverQueue.voiceChannel) {
                serverQueue.voiceChannel = newMember.voice.channel;
                console.log(`Changed serverQueue voiceChannel since Musix was moved to a different channel!`);
            }
        }
    }
}
