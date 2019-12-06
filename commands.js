'use strict';

const { Commander } = require('./lib/Commander');
const Guild = require('./models/guild');
const Player = require('./models/player');

const commander = new Commander({prefix: '!'});

commander.createCommand("hunted")
    .setHelp("Add player hunted list")
    .addArgument(arg => arg.string.setName("name"))
    .addArgument(arg => arg.string.setName('midName').optional())
    .addArgument(arg => arg.string.setName('lastName').optional())
    .run(async event => {
        const player = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''}`.trim();
        await event.reply(`${player} adicionado na lista de hunted`);
    });

commander.createCommand("guild")
    .setHelp("Add guild")
    .addArgument(arg => arg.string.setName('name'))
    .addArgument(arg => arg.string.setName('midName').optional())
    .addArgument(arg => arg.string.setName('lastName').optional())
    .addArgument(arg => arg.string.setName('lastName2').optional())
    .run(async event => {

        const channelName = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''} ${event.arguments.lastName2}`;

        const guild = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''} ${event.arguments.lastName2}`
            .replace(' ', '').replace(' ', '').replace(' ', '').trim().toLowerCase();

        const channelTs = await global.teamspeak.channelCreate(channelName, {channel_maxclients: 0, channel_flag_maxclients_unlimited: 0, channel_maxfamilyclients: 0, channel_flag_maxfamilyclients_inherited: 0 , channel_flag_permanent: true, channel_order: 48});

        let guildName = new Guild({name: guild, tsId: channelTs.propcache.cid});

        await event.reply(` Guild adicionada a lista de monitoramento.`);
    });


module.exports = commander;
