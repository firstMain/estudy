'use strict';

const Guild = require('../models/guild');

module.exports = async () => {
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
};