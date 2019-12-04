'use strict';

const rp      = require('request-promise');
const cheerio = require('cheerio');
const moment  = require('moment-timezone');
const { TeamSpeak } = require("ts3-nodejs-library");

const GUILDS = [
    {name: 'beibos', tsId: '47', dmlId: '7'},
    {name: 'outplay', tsId: '46', dmlId: '338'}
];

let info = {
    'beibos': [],
    'outplay': [],
};

let oldInfo = {
    'beibos': [],
    'outplay': [],
};

let online = {
    'beibos': [],
    'outplay': [],
};

let up = {
    'beibos' : [],
    'outplay': [],
};

(async () => {

    const execute = async () => {
        for (const guild of GUILDS) {
            const players = [];

            const options = {

                uri: `https://www.demolidores.com.br/?subtopic=guilds&action=show&guild=${guild.dmlId}`,
                method: "GET",
                headers: {
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
                },
            };

            const response = await rp(options);
            const $ = await cheerio.load(response);

            $('font[color="green"]').each((i, el) => {
                players.push(el.children[0].data);
            });

            for(const player of players) {

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

                let status   = $('.TableContent > tbody > tr > td:nth-child(2) > span > font').attr('color');
                let resets   = $('.TableContent > tbody > tr:nth-child(6) > td:nth-child(2) > span').text();
                let level    = $('.TableContent > tbody > tr:nth-child(5) > td:nth-child(2) > span').text();

                status = status === 'red' ? 'offline' : 'online';
                const name = player.replace(' ', '').replace(' ', '').replace(' ', '').replace('\,/*-/\'/', '').trim().toLowerCase();

                const data = {
                    name: player,
                    resets: resets,
                    level: level,
                    status: status,
                };

                await setInfo(guild.name, data, name);
            }

            await syncPlayers(guild.name);

            const description = await parseDescription(guild.name);

            global.teamspeak.channelEdit(guild.tsId, {channel_description: description});

            console.log(`GUILD ${guild.name.toUpperCase()} ATUALIZADA NO TS`);

        }
    };

    const syncPlayers = async (guild) => {

        await clearOnline(guild);
        await clearUp(guild);

        for (const p in info[guild]) {

            //PLAYER && INFO É AS NOVAS INFORMAÇÕES
            // OLDINFO SÃO AS VELHAS INFORMAÇÕES
            let player = info[guild][p];
            let old = oldInfo[guild][p];

            // VERIFICA SE TEM INFORMAÇÃO ANTIGA, CASO SIM VERIFICA
            // SE O LEVEL DAS INFORMAÇÕES NOVAS SÃO MAIOR QUE A ANTIGA
            if (old && player.level > old.level) {
                await setOldInfo(guild, player, p);
                await up[guild].push({
                    name: player.name,
                    level: player.level,
                    resets: player.resets,
                    status: player.status,
                    old: old,
                });

            } else if (old && player.level < old.level) {
                await online[guild].push({
                    name: player.name,
                    level: player.level,
                    resets: player.resets,
                    status: player.status,
                });
            } else if (old && player.level === old.level) {
                await online[guild].push({
                    name: player.name,
                    level: player.level,
                    resets: player.resets,
                    status: player.status,
                });
            } else {
                await setOldInfo(guild, player, p);
                await online[guild].push({
                    name: player.name,
                    level: player.level,
                    resets: player.resets,
                    status: player.status,
                });
            }
        }
    };

    const parseDescription = async (guild) => {
        let description = `Atualizado em : ${moment().tz('America/Recife').format('H:m:s')} \n`;
         description += '============================ UPANDO ============================ \n \n';

        for (const p in up[guild]) {
            const player = up[guild][p];
            let gained = (parseInt(player.level) - parseInt(player.old.level));

            if (player && player.name && (player.name !== '' || player.name !== ' ')) {
                description += (`${player.name}  |  RR : ${player.resets}   |  Lv : ${player.level}  |  Antes : ${player.old.level} Lv  |  Ganho : ${gained} Lv  \n \n `);
            }
        }

        description += '============================ ONLINE ============================= \n \n';

        for (const p in online[guild]) {
            const player = online[guild][p];

            if (player && player.name && (player.name !== '' || player.name !== ' ')) {
                description += (`${player.name}  |  RR : ${player.resets}   |  Lv : ${player.level} \n \n `);
            }
        }

        return description;
    };

    // FINAL EXECUTE

    const teamspeak = async () => {
        await TeamSpeak.connect({
            host: "35.247.201.139",
            nickname: "DU BOT",
            username: 'dubot',
            password: 'P3S0i0Hk4KFn',
            serverport: '9007',
        }).then((teamspeak) => {
            console.log('Conexão Feita');
            global.teamspeak = teamspeak;
        });
    };

    const clearOnline = async (guild) => {
          online[guild] = [];
    };

    const clearUp = async (guild) => {
        up[guild] = [];
    };

    const setInfo = async (guild, player, index) => {
        info[guild][index] = player;
        return info;
    };

    const setOldInfo = async (guild, player, index) => {
        oldInfo[guild][index] = player;
        return oldInfo;
    };

    const sleep = async (ms) => {
        return new Promise(resolve=>{
            setTimeout(resolve,ms)
        })
    };

    const run = async () => {
        await execute();
        await sleep(20000);
        await run();
    };

    await teamspeak();
    await run();
})();


