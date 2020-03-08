const { Client, Collection } = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const events = '../events/';

module.exports = class extends Client {
    constructor() {
        super({
            disableEveryone: true,
            disabledEvents: ['TYPING_START']
        });
        this.commands = new Collection();
        this.commandAliases = new Collection();
        this.radio = new Map();
        this.funcs = {};
        this.dispatcher = {};
        this.config = require('../config.js');

        fs.readdirSync(path.join(__dirname, 'funcs')).forEach(filename => {
            this.funcs[filename.slice(0, -3)] = require(`./funcs/${filename}`);
        });

        const commandFiles = fs.readdirSync(path.join(path.dirname(__dirname), 'commands')).filter(f => f.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            command.uses = 0;
            this.commands.set(command.name, command);
            this.commandAliases.set(command.alias, command);
        }

        client.stations = fetch('https://gitea.cwinfo.org/cwchristerw/radio/raw/branch/master/playlist.json')
            .then(res => res.json());

        this.on('ready', () => {
            require(`${events}ready`).execute(this, Discord);
        });
        this.on('message', (msg) => {
            require(`${events}msg`).execute(this, msg, Discord);
        });
        this.on('voiceStateUpdate', (oldState, newState) => {
            require(`${events}voiceStateUpdate`).execute(this, oldState, newState);
        });
        this.on('error', (error) => {
            client.channels.fetch(client.config.debug_channel).send('Error: ' + error);
        });

        this.login(this.config.token).catch(err => console.log('Failed to login: ' + err));
    }
};
