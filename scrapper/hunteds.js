'use strict';

const rp      = require('request-promise');
const Hunted  = require('../models/hunted');
const cheerio = require('cheerio');
const moment  = require('moment-timezone');

module.exports = async () => {
    console.log('Iniciando Hunteds');
    const players = [];

    return new Promise(async(resolve, reject) => {
        const hunteds = await Hunted.find({});

        for (const hunted of hunteds) {
            try {

                const target = await Hunted.findOne({name: hunted.name});

                const options = {

                    uri: `https://www.demolidores.com.br/?subtopic=characters&name=${hunted.name}`,
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

                status = status === 'red' ? 'offline' : 'online';

                let verified_at = moment().tz('America/Recife').format('HH:mm:s');

                players.push({
                    name: target.name,
                    level: level,
                    resets: resets,
                    status: status,
                    verified: verified_at,
                    dbId: target.id
                });

            } catch (err) {
                console.log('Algum erro inesperado', err.message);
            }
        }

        const parseDescription = async (players) => {

            const hunteds = {online: [], up: []};

            for (const player of players) {
                const target = await Hunted.findOne({_id: player.dbId});

                if (target && target.level && player.status === 'online' && player.level > target.level) {
                    hunteds.up.push(player);
                } else if (target && target.level && player.status === 'online' && (player.level <= target.level || player.level === target.level)) {
                    hunteds.online.push(player);
                } else if(player.status === 'online') {
                    hunteds.online.push(player);
                }
            }

            let description = '============================ UPANDO ============================ \n \n';

            for (const player of hunteds['up']) {
                const target = await Hunted.findOne({_id: player.dbId});
                let gained = (parseInt(player.level) - parseInt(target.level));

                if (player && player.name && (player.name !== '' || player.name !== ' ')) {
                    description += (`${player.name}  |  RR : ${player.resets}  |  Lv : ${player.level}  |  Antes : ${target.level} Lv  |  Ganho : ${gained} Lv  |  Atualizado : ${player.verified} \n \n `);
                    description+= '------------------------------------------------------------------------------------------------------------------------------------------------ \n';
                }

                target.status    = player.status;
                target.resets    = player.resets;
                target.level     = player.level;
                target.verified  = player.verified;
                await target.save();
            }

            description += '============================ ONLINE ============================= \n \n';

            for (const player of hunteds['online']) {
                const target = await Hunted.findOne({_id: player.dbId});

                if (player && player.name && (player.name !== '' || player.name !== ' ')) {
                    description += (`${player.name}  |  RR : ${player.resets}   |  Lv : ${player.level} \n \n `);
                }

                target.status    = player.status;
                target.resets    = player.resets;
                target.level     = player.level;
                target.verified  = player.verified;
                await target.save();
            }

            await global.teamspeak.channelEdit(28, {channel_description: description});

            return description;
        };

        resolve(parseDescription(players));
    });
};