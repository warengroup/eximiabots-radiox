import Discord from "discord.js";
const {
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel
} = require("@discordjs/voice");

module.exports = {
    async execute(client, guilds) {
        if(!client.stations) return;

        guilds.forEach(async guild => {
            let state = client.funcs.loadState(client, guild);
            if(!state) return;
            if(!state.station || !state.channels.voice || !state.channels.text) return;

            const sstation = await client.funcs.searchStation(state.station.name, client);
            let url = sstation.stream[sstation.stream.default];
            let station = sstation;

            const construct = {
                textChannel: client.channels.cache.get(state.channels.text),
                voiceChannel: client.channels.cache.get(state.channels.voice),
                connection: null,
                message: null,
                audioPlayer: createAudioPlayer(),
                station: station
            };
            client.radio.set(guild.id, construct);

            try {
                let voiceChannel = client.channels.cache.get(state.channels.voice);
                const connection =
                    getVoiceConnection(guild.id) ??
                    joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: voiceChannel.guild.id,
                        adapterCreator: voiceChannel.guild.voiceAdapterCreator
                    });

                construct.connection = connection;
                let date = new Date();
                construct.startTime = date.getTime();
                
                play(null, guild, client, url, Discord);
    
                client.datastore.checkEntry(guild.id);
                construct.datastore = client.datastore.getEntry(guild.id);
    
                if (!construct.datastore.statistics[construct.station.name]) {
                    construct.datastore.statistics[construct.station.name] = {};
                    construct.datastore.statistics[construct.station.name].time = 0;
                    construct.datastore.statistics[construct.station.name].used = 0;
                    client.datastore.updateEntry(guild, construct.datastore);
                }
            } catch (error) {
                console.log(error);
            }
        });
    }
}

async function play(interaction, guild, client, url, Discord) {
    let message = {};
    const radio = client.radio.get(guild.id);
    const resource = createAudioResource(url);
    radio.connection.subscribe(radio.audioPlayer);
    radio.audioPlayer.play(resource);
    resource.playStream
        .on("readable", () => {
            client.funcs.logger('Radio', 'Stream started' + " / " + guild.id + " / " + radio.station.name);
        })
        .on("finish", () => {
            client.funcs.logger('Radio', 'Stream finished' + " / " + guild.id);
            client.funcs.statisticsUpdate(client, guild, radio);
            radio.connection?.destroy();
            radio.audioPlayer?.stop();
            client.radio.delete(guild.id);
            return;
        })
        .on("error", error => {
            client.funcs.logger('Radio', 'Stream errored');
            console.error(error);
            radio.connection?.destroy();
            radio.audioPlayer?.stop();
            client.radio.delete(guild.id);
        });

    message.nowplayingDescription = client.messages.nowplayingDescription.replace("%radio.station.name%", radio.station.name);
    message.nowplayingDescription = message.nowplayingDescription.replace("%radio.station.owner%", radio.station.owner);
    message.nowplayingDescription = message.nowplayingDescription.replace("%client.funcs.msToTime(completed)%", "");
    message.nowplayingDescription = message.nowplayingDescription.replace("Owner: ", "");
    message.nowplayingDescription = message.nowplayingDescription.replace("**", "");
    message.nowplayingDescription = message.nowplayingDescription.replace("**", "");

    const embed = new Discord.MessageEmbed()
        .setTitle(client.user.username)
        .setThumbnail((radio.station.logo || "https://cdn.discordapp.com/emojis/" + client.messageEmojis["play"].replace(/[^0-9]+/g, '')))
        .setColor(client.config.embedColor)
        .addField(client.messages.nowplayingTitle, message.nowplayingDescription, true)
        .setImage('https://waren.io/berriabot-temp-sa7a36a9xm6837br/images/empty-3.png')
        .setFooter(client.messages.footerText, "https://cdn.discordapp.com/emojis/" + client.messageEmojis["eximiabots"].replace(/[^0-9]+/g, ''));
    
    const buttons = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('list')
                .setEmoji(client.messageEmojis["list"])
                .setStyle('SECONDARY')
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('prev')
                .setEmoji(client.messageEmojis["prev"])
                .setStyle('SECONDARY')
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('stop')
                .setEmoji(client.messageEmojis["stop"])
                .setStyle('SECONDARY')
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('next')
                .setEmoji(client.messageEmojis["next"])
                .setStyle('SECONDARY')
        )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('statistics')
                .setEmoji(client.messageEmojis["statistics"])
                .setStyle('SECONDARY')
        );

    if(!radio.message){
        radio.message = await radio.textChannel.send({ embeds: [embed], components: [buttons] });
    } else {
        radio.message.edit({ embeds: [embed], components: [buttons] });
    }

    message.play = client.messages.play.replace("%radio.station.name%", radio.station.name);
    
}
