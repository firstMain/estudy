'use strict';

const { TeamSpeak } = require("ts3-nodejs-library");

TeamSpeak.connect({
    host: "35.247.201.139",
    nickname: "DU BOT",
    username: 'dubot',
    password: 'P3S0i0Hk4KFn',
    serverport: '9007',
}).then(async teamspeak => {


    // const whoami = await teamspeak.whoami()
    // console.log(whoami)

    // const channel = await teamspeak.getChannelByName('WATCHERS');
    //
    // const info = await channel.getInfo();
    //
    // await teamspeak.channelEdit(channel.cid, {channel_description: 'O PADRAO VAI SER COM (,) EX : Dudu,Alissinho,Lollz'});
    //
    // console.log(newChannel);

    // await teamspeak.clientPoke(1, 'Dubot avisa que daqui ha algumas semana vai lançar a versão 2.0 GLOBAL com vários sistemas, e website para configuração do seu bot');

    // const clients = await teamspeak.clientList({ client_type: 0 })
    //
    // clients.forEach(client => {
    //     console.log('NAME', client.nickname, 'cuid', client.clid);
    // //     // console.log("Sending 'Hello!' Message to", client.nickname);
    // //     // client.message("Olá eu sou o DuBot em que posso te ajudar?")
    // });
}).catch(e => {
    console.log("Catched an error!");
    console.error(e)
});

