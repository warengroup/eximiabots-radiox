import { Snowflake } from "discord.js";

export default function isDev(devIDs : any[], authorID : Snowflake){
    for (const devID of devIDs){
        if(authorID == devID){
            return true;
        }
    }
}
