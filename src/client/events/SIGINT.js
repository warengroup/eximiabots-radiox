module.exports = {
    name: 'SIGINT',
    execute(client) {
        client.user.setStatus('dnd');

        console.log("\n");
        client.funcs.logger("Bot", "Closing");
        console.log("\n");

        client.funcs.saveRadios(client);
        
        setInterval(() => {
            if(client.radio.size == 0){
                process.exit();
            }
        }, 500);
    }
}