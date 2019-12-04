'use strict';

const rp      = require('request-promise');
const cheerio = require('cheerio');
const moment  = require('moment-timezone');
const { TeamSpeak } = require("ts3-nodejs-library");
const { Commander } = require('./lib/Commander');

const commander = new Commander({prefix: '!'});

const GUILDS = [
    {name: 'beibos', tsId: '47', dmlId: '7'},
    {name: 'outplay', tsId: '46', dmlId: '338'},
    {name: 'silencer', tsId: '48', dmlId: '298'}
];

let info = {};

let oldInfo = {};

let online = {};

let up = {};

for (const guild of GUILDS) {
    info[guild.name]    = [];
    oldInfo[guild.name] = [];
    online[guild.name]  = [];
    up[guild.name]      = [];
}

commander.createCommand("hunted")
    .setHelp("Add player hunted list")
    .addArgument(arg => arg.string.setName("name"))
    .addArgument(arg => arg.string.setName('midName').optional())
    .addArgument(arg => arg.string.setName('lastName').optional())
    .run(async event => {
        const player = `${event.arguments.name} ${event.arguments.midName || ''} ${event.arguments.lastName || ''}`.trim();
        await event.reply(`${player} adicionado na lista de hunted`);
    });

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

                let verified_at = moment().tz('America/Recife').format('HH:mm:s');

                const data = {
                    name: player,
                    resets: resets,
                    level: level,
                    status: status,
                    verified: verified_at
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
                    verified: player.verified,
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
         let description = '============================ UPANDO ============================ \n \n';

        for (const p in up[guild]) {
            const player = up[guild][p];
            let gained = (parseInt(player.level) - parseInt(player.old.level));

            if (player && player.name && (player.name !== '' || player.name !== ' ')) {
                description += (`${player.name}  |  RR : ${player.resets}   |  Lv : ${player.level}  |  Antes : ${player.old.level} Lv  |  Ganho : ${gained} Lv  |  Atualizado : ${player.verified} \n \n `);
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
            commander.addInstance(global.teamspeak);
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


