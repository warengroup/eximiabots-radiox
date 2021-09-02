import Discord from "discord.js";

module.exports = {
    name: 'SIGINT',
    async execute(client) {
        setTimeout(async function () {
            let message = {};

            if (!client.stations) return process.exit();

            let currentRadios = client.radio.keys();
            let radio = currentRadios.next();

            while (!radio.done) {
                let currentRadio = client.radio.get(radio.value);
                currentRadio.guild = client.datastore.getEntry(radio.value).guild;

                if (currentRadio) {
                    client.funcs.statisticsUpdate(client, currentRadio.guild, currentRadio);
                    currentRadio.connection?.destroy();
                    currentRadio.audioPlayer?.stop();
                    currentRadio.message?.delete();
                    client.radio.delete(radio.value);
                }
                
                radio = currentRadios.next();
            }

            console.log("\n");
            client.funcs.logger("Bot", "Closing");
            console.log("\n");

            client.user.setStatus('dnd');

            setInterval(() => {
                if(radio.done){
                    process.exit();
                }
            }, 1000);
        }, 5000);
    }
}