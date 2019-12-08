'use strict';

const { Commander } = require('./lib/Commander');
const Guild = require('./models/guild');
const Player = require('./models/player');

const commander = new Commander({prefix: '!'});

commander.createCommand("hunted")
    .setHelp("Adiciona um player a lista de hunted, para isso informe apenas o nome do player")
    .addArgument(arg => arg.string.setName("name"))
    .addArgument(arg => arg.string.setName('midName').optional())
    .addArgument(arg => arg.string.setName('lastName').optional())
    .run(async event => {
        const player = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''}`.trim();
        await event.reply(`${player} adicionado na lista de hunted`);
    });

commander.createCommand("guild")
    .setHelp("Para adicionar uma guild, é preciso informar o ID da guild do proprio site, e o(s) nome(s) ")
    .addArgument(arg => arg.number.setName('dmlId'))
    .addArgument(arg => arg.string.setName('name'))
    .addArgument(arg => arg.string.setName('midName').optional())
    .addArgument(arg => arg.string.setName('lastName').optional())
    .addArgument(arg => arg.string.setName('lastName2').optional())
    .run(async event => {

        const channelName = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''} ${event.arguments.lastName2}`.trim().toUpperCase();

        const guild = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''} ${event.arguments.lastName2}`
            .replace(' ', '').replace(' ', '').replace(' ', '').trim().toLowerCase();

        const channelTs = await global.teamspeak.channelCreate(channelName,
            {
                channel_order: 29,
                channel_maxclients: 0,
                channel_flag_maxclients_unlimited: 0,
                channel_maxfamilyclients: 0,
                channel_flag_maxfamilyclients_inherited: 0 ,
                channel_flag_permanent: true
            });

        const guildName = new Guild({name: guild, tsId: channelTs.propcache.cid, dmlId: event.arguments.dmlId});

        await guildName.save();

        await event.reply(`Guild adicionada a lista de monitoramento.`);
    });


commander.createCommand("removeGuild")
    .setHelp("Remover a guild do monitoramento, digite o nome da guild")
    .addArgument(arg => arg.string.setName("name"))
    .addArgument(arg => arg.string.setName('midName').optional())
    .addArgument(arg => arg.string.setName('lastName').optional())
    .run(async event => {
        const player = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''}`.trim();
        await event.reply(`${player} adicionado na lista de hunted`);
    });


module.exports = commander;
