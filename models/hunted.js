'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const huntedSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    level: {
        type: String,
    },
    reset: {
        type: String,
    },
    status: {
        type: String,
    },
    verified: {
        type: Date,
    },
    lastLevel: {
        type: String,
    }
});

module.exports = mongoose.model('Hunted', huntedSchema);