const { Client, Collection } = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const events = './events/';
const Datastore = require('./datastore.js');

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
        this.funcs.check = require('./funcs/check.js');
        this.funcs.msToTime = require('./funcs/msToTime.js');
        this.funcs.statisticsUpdate = require('./funcs/statisticsUpdate.js');

        this.config = require('../config.js');
        this.messages = require('./messages.js');

        const commandFiles = fs.readdirSync('./client/commands/').filter(f => f.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            command.uses = 0;
            this.commands.set(command.name, command);
            this.commandAliases.set(command.alias, command);
        }

        this.on('ready', () => {
            require(`${events}ready`).execute(this, Discord);
            this.datastore = new Datastore();
        });
        this.on('message', (msg) => {
            require(`${events}msg`).execute(this, msg, Discord);
        });
        this.on('voiceStateUpdate', (oldState, newState) => {
            require(`${events}voiceStateUpdate`).execute(this, oldState, newState);
        });
        this.on('error', (error) => {
            console.error(error);
        });

        this.login(this.config.token).catch(err => console.log('Failed to login: ' + err));
    }
};
