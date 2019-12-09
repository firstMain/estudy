'use strict';

const { Commander } = require('./lib/Commander');
const guild = require('./commands/guild');
const hunted = require('./commands/hunted');

global.commander = new Commander({prefix: '!'});

guild();
hunted();

module.exports = commander;
