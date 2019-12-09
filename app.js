'use strict';

const { TeamSpeak } = require("ts3-nodejs-library");
const commander  = require('./commands');
const mongoose = require('mongoose');
const scanHunteds = require('./scrapper/hunteds');
const scanGuilds  = require('./scrapper/guilds');
const chalk = require('chalk');

(async () => {

    const teamspeak = async () => {
        await TeamSpeak.connect({
            host: "35.247.201.139",
            nickname: "DU BOT",
            username: 'dubot',
            password: 'P3S0i0Hk4KFn',
            serverport: '9007',
        }).then((teamspeak) => {
            console.log(chalk.green('TeamSpeak Server Connected'));
            global.teamspeak = teamspeak;

            commander.addInstance(global.teamspeak);

            teamspeak.on("close", async () => {
                console.log(chalk.red("disconnected, trying to reconnect..."));
                await teamspeak.reconnect(-1, 1000);
                console.log(chalk.green("reconnected!"));
            });

        });
    };

    const sleep = async (ms) => {
        return new Promise(resolve=>{
            setTimeout(resolve,ms)
        })
    };

    const connect = async () => {
      await mongoose.connect("mongodb://dubot:duduaki123@ds253398.mlab.com:53398/dubot", {useNewUrlParser: true, useUnifiedTopology: true});
      console.log(chalk.green('Mongo DB Connected'));
    };

    const run = async () => {
         scanHunteds();
         await scanGuilds();
        await sleep(20000);
        await run();
    };

    await connect();
    await teamspeak();
    await run();
})();


