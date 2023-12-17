export const messages = {
    replace(message: string, variables: { [key: string]: string }){
        for(let variable in variables){
            if(variable.includes('%')){
                message = message.replace(variable, variables[variable]);
            } else if(variable.includes(':')){
                message = message.replace(variable.split(':')[0], variables[variable]);
            } else {
                message = message.replace(variable, variables[variable]);
            }
        }
        return message;
    },
    wrongVoiceChannel: "You need to be in the same voice channel as RadioX to use this command!",
    noPerms: "You need the %command.permission% permission to use this command!",
    notPlaying: "There is nothing playing!",
    runningCommandFailed: "Running this command failed!",
    noPermsEmbed: "I cannot send embeds (Embed links).",
    helpTitle: "Help",
    helpDescription: "Join to our support server" + "\n" + "%client.config.supportGuild%",
    inviteTitle: "Invite %client.user.username% to your Discord server!",
    listTitle: "Radio Stations",
    playTitle1: ":radio: Channel",
    playDescription1: "__%radio.station.name%__" + "\n" + "%radio.station.owner%",
    playTitle2: ":musical_note: Track",
    playDescription2: "%radio.station.track%",
    playTitle3: ":stopwatch: Duration",
    playDescription3: "%client.funcs.msToTime(completed)%",
    noVoiceChannel: "You need to be in a voice channel to play radio!",
    noQuery: "You need to use a number or search for a supported station!",
    noPermsConnect: "I cannot connect to your voice channel.",
    noPermsSpeak: "I cannot speak in your voice channel.",
    wrongStationNumber: "No such station!",
    tooShortSearch: "Station must be over 2 characters!",
    noSearchResults: "No stations found!",
    errorPlaying: "An error has occured while playing radio!",
    play: "Start playing: %radio.station.name%",
    stop: "Stopped playback!",
    statisticsTitle: "Statistics",
    maintenanceTitle: "Maintenance",
    errorToGetPlaylist: "You can't use this bot because it has no playlist available. Check more information in our Discord support server %client.config.supportGuild% !",
    notAllowed: "You are not allowed to do that!",
    sendedMaintenanceMessage: "This bot is going to be under maintenance!",
    footerText: "EximiaBots by Warén Group",
    statusTitle: "%client.user.username% Status",
    statusField1: ":clock1: Bot Uptime",
    statusField2: ":floppy_disk: Bot Version",
    statusField3: ":heartbeat: WebSocket Ping",
    statusField4: ":hourglass: Latency",
    statusField5: ":globe_with_meridians: Hosted by",
    errorStationURL: "Station can't be URL",
    maintenance: "Shhhh... We are now sleeping and dreaming about new features to implement. Will be back soon.",
    emojis: {
        logo: "<:RadioX:688765708808487072>",
        eximiabots: "<:EximiaBots:693277919929303132>",
        list: "<:RadioXList:688541155519889482>",
        play: "<:RadioXPlay:688541155712827458>",
        stop: "<:RadioXStop:688541155377414168>",
        statistics: "<:RadioXStatistics:694954485507686421>",
        maintenance: "<:RadioXMaintenance:695043843057254493>",
        error: "<:RadioXError:688541155792781320>",
        prev: "<:RadioXPrev:882153637370023957>",
        next: "<:RadioXNext:882153637474893834>"
    }
};
