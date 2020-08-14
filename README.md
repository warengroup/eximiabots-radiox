# RadioX by EximiaBots
We will bring you finnish radio to your discord server.

## Docker
1. `docker build -t warengroup/eximiabots-radiox .`
2. `docker run --name radiox-dev -d --net host -e DISCORD_TOKEN= -e RADIOX_PREFIX="rx-" -v $PWD/datastore:/usr/src/app/datastore/ warengroup/eximiabots-radiox`

##Join our Discord Server
https://discord.gg/rRA65Mn