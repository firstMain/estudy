'use strict';

const rp      = require('request-promise');
const cheerio = require('cheerio');
const moment  = require('moment');
const { TeamSpeak } = require("ts3-nodejs-library");

let info    = [];
let oldInfo = [];

const GUILDS = [
    {name: 'BEIBOS', tsId: '47', dmlId: '7'},
    {name: 'OUT PLAY', tsId: '46', dmlId: '338'}
];

(async() => {

    const execute = async (guild) => {
        let players = [];
        let online  = [];
        let up      = [];

        const sync = async (channel) => {
            await global.teamspeak.channelEdit(channel, {channel_description: await parseText()});
        };

        const parsePlayers = async () => {

            for(const p in info) {

                //PLAYER && INFO É AS NOVAS INFORMAÇÕES
                // OLDINFO SÃO AS VELHAS INFORMAÇÕES
                let player = info[p];
                let old = oldInfo[p];

                // VERIFICA SE TEM INFORMAÇÃO ANTIGA, CASO SIM VERIFICA
                // SE O LEVEL DAS INFORMAÇÕES NOVAS SÃO MAIOR QUE A ANTIGA
                if (old && player.level > old.level) {
                    oldInfo[p] = {
                        name:   player.name,
                        resets: player.resets,
                        level:  player.level,
                        status: player.status,
                    };

                    up[p] = {
                        name:   player.name,
                        resets: player.resets,
                        level:  player.level,
                        status: player.status,
                        old: old,
                    };
                } else if (old && player.level < old.level) {
                    online[p] = {
                        name:   player.name,
                        resets: player.resets,
                        level:  player.level,
                        status: player.status,
                    };
                } else if (old && player.level === old.level) {
                    online[p] = {
                        name:   player.name,
                        resets: player.resets,
                        level:  player.level,
                        status: player.status,
                    };
                } else {
                    oldInfo[p] = {
                        name:   player.name,
                        resets: player.resets,
                        level:  player.level,
                        status: player.status,
                    };

                    online[p] = {
                        name:   player.name,
                        resets: player.resets,
                        level:  player.level,
                        status: player.status,
                    };
                }
            }
        };

        const parseText = async () => {
            let text = '';

            text = 'ONLINE \n \n';

            for(const p in online) {
                const player = online[p];

                if (player && player !== '' && player !== ' ' && player !== undefined) {
                    console.log('ONLINE', player.name);
                    text = text + `${player.name} | RR : ${player.resets} | LV : ${player.level} \n`;
                    // text = text + '-------------------------------------------------------------------------------------------------- \n';
                }

                online[p] = null;
            }

            text = text + 'UPANDO \n \n';

            for (const p in up) {
                const player = up[p];

                if (player && player !== '' && player !== ' ' && player !== undefined) {
                    let gained = (parseInt(player.level) - parseInt(player.old.level));
                    text = text + `${player.name} | RR : ${player.resets} | LV : ${player.level}  | Antes : LV : ${player.old.level}  | Ganho : ${gained} Lv \n`;
                    // text = text + '-------------------------------------------------------------------------------------------------- \n';
                }
                up[p] = null;
            }

            // console.log(text);

            return text;
        };

            players = [];
            online  = [];
            up      = [];

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
                console.log('Pesquisando Player : ', player);
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
                const name = player.replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').trim().toLowerCase();

                info[name] = {
                    name: player,
                    resets: resets,
                    level: level,
                    status: status,
                };

            }

          await sync(guild.tsId);
          await parsePlayers();
    };


    const run = async () => {
        for(const guild of GUILDS) {
            await execute(guild);
        }
        await sleep(20000);
        await run();
    };

    const sleep = async (ms) => {
        return new Promise(resolve=>{
            setTimeout(resolve,ms)
        })
    };

    const teamspeak = async () => {
        console.log('iniciando conexão');
            await TeamSpeak.connect({
            host: "35.247.201.139",
            nickname: "DU BOT",
            username: 'dubot',
            password: 'P3S0i0Hk4KFn',
            serverport: '9007',
        }).then((teamspeak) => {
            console.log('conexão feita');
            global.teamspeak = teamspeak;
        });
    };

    await teamspeak();
    
    await run();

})();
