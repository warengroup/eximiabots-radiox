require('dotenv/config');

module.exports = {

    //credentials
    token: process.env.DISCORD_TOKEN,

    //radio stations
    stationslistUrl: process.env.RADIOX_STATIONSLISTURL || "https://git.cwinfo.net/cwchristerw/radio/raw/branch/master/playlist.json",

    //support
    supportGuild: "https://discord.gg/rRA65Mn",
    devId: [
        "493174343484833802",
        "360363051792203779"
    ],

    //misc
    embedColor: "#88aa00",
    hostedBy: "[Warén Group](https://waren.io)",

    //Settings
    version: process.env.DEV_MODE ? process.env.npm_package_version + "-dev" : process.env.npm_package_version,
    debug: process.env.DEBUG_MODE || false,
    devMode: process.env.DEV_MODE || false,
    maintenanceMode: false,
    streamerMode: process.env.STREAMER_MODE || "manual"
}
