'use strict';

const Hunted = require('../models/hunted');
const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = async () => {

    commander.createCommand("player-info")
        .setHelp("Adiciona um player a lista de hunted, para isso informe apenas o nome do player")
        .addArgument(arg => arg.string.setName("name"))
        .addArgument(arg => arg.string.setName('midName').optional())
        .addArgument(arg => arg.string.setName('lastName').optional())
        .addArgument(arg => arg.string.setName('lastName2').optional())
        .run(async event => {
            const player = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''} ${event.arguments.lastName2 || ''}`.trim();

            // console.log('PLAYER', player);
            const playerDB = await Hunted.find({name: player});
            console.log('pLAYER', playerDB);
            await event.reply(`${playerDB}`);
        });

    commander.createCommand("player-scan")
        .setHelp("Player Scan, para isso informe apenas o nome do player")
        .addArgument(arg => arg.string.setName("name"))
        .addArgument(arg => arg.string.setName('midName').optional())
        .addArgument(arg => arg.string.setName('lastName').optional())
        .addArgument(arg => arg.string.setName('lastName2').optional())
        .run(async event => {
            try {

                const player = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''} ${event.arguments.lastName2 || ''}`.trim();

                const options = {

                    uri: `https://www.demolidores.com.br/?subtopic=characters&name=${player}`,
                    method: "GET",
                    headers: {
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "none",
                        "sec-fetch-user": "?1",
                        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
                    },
                };

                const res = await rp(options);

                const $ = await cheerio.load(res);

                let status = $('.TableContent > tbody > tr > td:nth-child(2) > span > font').attr('color');
                let resets = $('.TableContent > tbody > tr:nth-child(6) > td:nth-child(2) > span').text();
                let level = $('.TableContent > tbody > tr:nth-child(5) > td:nth-child(2) > span').text();

                if (!level && !resets && !status) {
                    return await event.reply('Player não foi encontrado.');
                }

                status = status === 'red' ? 'offline' : 'online';

                await event.reply(`Player ${player} - Level : ${level} - RR : ${resets} - Status : ${status}`);

            } catch(err) {
                console.log('Error ao mostrar a lista de hunteds', err.message);
                return await event.reply(`Um erro inesperado aconteceu, tente novamente mais tarde.`);
            }
        });


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