import { Snowflake } from "discord.js";

export default function isDev(devIDs : string[], authorID : Snowflake){
    for (const devID of devIDs){
        if(authorID == devID){
            return true;
        }
    }
}
