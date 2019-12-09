'use strict';

const { Commander } = require('./lib/Commander');
const Guild = require('./models/guild');
const Player = require('./models/player');
const Hunted = require('./models/hunted');

const commander = new Commander({prefix: '!'});

commander.createCommand("hunted-add")
    .setHelp("Adiciona um player a lista de hunted, para isso informe apenas o nome do player")
    .addArgument(arg => arg.string.setName("name").minimum(3))
    .addArgument(arg => arg.string.setName('midName').optional())
    .addArgument(arg => arg.string.setName('lastName').optional())
    .run(async event => {
        const player = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''}`.trim();

        await new Hunted({name: player}).save();

        await event.reply(`${player} adicionado na lista de hunted`);
    });

commander.createCommand("hunted-remove")
    .setHelp("Remove um player a lista de hunted, para isso informe apenas o nome do player")
    .addArgument(arg => arg.string.setName("name"))
    .addArgument(arg => arg.string.setName('midName').optional())
    .addArgument(arg => arg.string.setName('lastName').optional())
    .run(async event => {
        const player = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''}`.trim();

        try {
            const hunted = await Hunted.deleteOne({name: player});

            if (hunted.deletedCount) {
                return await event.reply(`${player.toUpperCase()} removido da lista de hunted`);
            }

            return await event.reply(`Não foi possível remover o player : ${player.toUpperCase()} da lista de hunted`);

        } catch(err) {
            return await event.reply(`Um erro inesperado aconteceu, tente novamente mais tarde.`);
        }
    });

commander.createCommand("hunted-clear")
    .setHelp("Limpar a lista de hunteds")
    .run(async event => {
        try {
            const hunteds = await Hunted.deleteMany({});

            if (!hunteds.length) {
                return await event.reply('Lista de hunteds esvaziada, utilize o comando !man hunted-add para saber mais.');
            }

            return await event.reply('Lista de hunteds vazia, utilize o comando !man hunted-add para saber mais.');
        } catch(err) {
            console.log('Error ao limpar a lista de hunteds', err.message);
            return await event.reply(`Um erro inesperado aconteceu, tente novamente mais tarde.`);
        }
    });

commander.createCommand("hunted-list")
    .setHelp("Hunted List")
    .run(async event => {
        try {
            const hunteds = await Hunted.find({});

            if (hunteds.length) {
                return await event.reply(`Total : ${hunteds.length}`);
            }

            return await event.reply('Lista de hunteds vazia, utilize o comando !man hunted-add para saber mais.');
        } catch(err) {
            console.log('Error ao mostrar a lista de hunteds', err.message);
            return await event.reply(`Um erro inesperado aconteceu, tente novamente mais tarde.`);
        }
    });

commander.createCommand("guild-add")
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

        const guildName = new Guild({name: guild, tsId: channelTs.propcache.cid, dmlId: event.arguments.dmlId, tsName: channelName});

        await guildName.save();

        await event.reply(`Guild adicionada a lista de monitoramento.`);
    });


commander.createCommand("guild-remove")
    .setHelp("Remover a guild do monitoramento, digite o nome da guild")
    .addArgument(arg => arg.string.setName('name'))
    .addArgument(arg => arg.string.setName('midName').optional())
    .addArgument(arg => arg.string.setName('lastName').optional())
    .addArgument(arg => arg.string.setName('lastName2').optional())
    .run(async event => {
        const guildName = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''} ${event.arguments.lastName2}`.trim().toUpperCase();

        try {
            const channel = await Guild.findOne({tsName: guildName});

            if (channel) {
                const guildDeleted = await Guild.deleteOne({tsId: channel.tsId});

                if (guildDeleted.deletedCount) {
                    await global.teamspeak.channelDelete(channel.tsId);

                    return await event.reply(`Guild : ${guildName.toUpperCase()} foi removida da lista de monitoramento.`);
                }
            }
            return await event.reply(`Não foi Possível excluir a Guild : ${guildName.toUpperCase()} da lista de monitoramento`);
        } catch(err) {
            console.log('Error ao deletar a guild', err.message);
            return await event.reply(`Um erro inesperado aconteceu, tente novamente mais tarde.`);
        }
    });


module.exports = commander;
