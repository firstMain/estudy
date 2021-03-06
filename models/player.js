'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    resets: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    verified: {
        type: String,
        required: true,
    },
    lastLevel: {
        type: String,
    }
});

module.exports = mongoose.model('Player', playerSchema);