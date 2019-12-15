'use strict';

const Hunted = require('../models/hunted');

module.exports = async () => {
    commander.createCommand("hunted-add")
        .setHelp("Adiciona um player a lista de hunted, para isso informe apenas o nome do player")
        .addArgument(arg => arg.string.setName("name"))
        .addArgument(arg => arg.string.setName('midName').optional())
        .addArgument(arg => arg.string.setName('lastName').optional())
        .addArgument(arg => arg.string.setName('lastName2').optional())
        .run(async event => {
            const player = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''} ${event.arguments.lastName2 || ''}`.trim();

            await new Hunted({name: player}).save();

            await event.reply(`${player} adicionado na lista de hunted`);
        });

    commander.createCommand("hunted-remove")
        .setHelp("Remove um player a lista de hunted, para isso informe apenas o nome do player")
        .addArgument(arg => arg.string.setName("name"))
        .addArgument(arg => arg.string.setName('midName').optional())
        .addArgument(arg => arg.string.setName('lastName').optional())
        .addArgument(arg => arg.string.setName('lastName2').optional())
        .run(async event => {
            const player = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''} ${event.arguments.lastName2 || ''}`.trim();

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
};