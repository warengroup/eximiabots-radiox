import { ColorResolvable } from "discord.js";

export default {

    //credentials
    token: process.env.DISCORD_TOKEN,

    //radio stations
    stationslistUrl: process.env.RADIOX_STATIONSLISTURL || "https://git.cwinfo.net/cwchristerw/radio/raw/branch/master/playlist.json",

    //support
    supportGuild: "https://discord.gg/rRA65Mn",
    devIDs: [
        "493174343484833802",
        "360363051792203779"
    ],

    //misc
    embedColor: "#88aa00" as ColorResolvable,
    hostedBy: "[Warén Group](https://waren.io)",

    //Settings
    version: process.env.DEV_MODE ? (process.env.npm_package_version ?? "0.0.0") + "-dev" : process.env.npm_package_version ?? "-",
    debug: process.env.DEBUG_MODE || false,
    devMode: process.env.DEV_MODE || false,
    maintenanceMode: false,
    streamerMode: process.env.STREAMER_MODE || "manual"
}
