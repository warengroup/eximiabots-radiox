module.exports = {
    name: 'messageDelete',
    async execute(client, msg) {
        if(!msg.author.bot || !msg.guild) return;
        const radio = client.radio.get(msg.guild.id);
        if(!radio) return;
        if(!radio.message) return;
        if(msg.id != radio.message.id) return;
        radio.message = null;
    }
}
