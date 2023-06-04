import { Message } from "discord.js";

export default {
    name: 'messageDelete',
    async execute(client: any, msg: Message) {
        if(!msg.author.bot || !msg.guild) return;
        const radio = client.radio.get(msg.guild.id);
        if(!radio) return;
        if(!radio.message) return;
        if(msg.id != radio.message.id) return;
        radio.message = null;
    }
}
