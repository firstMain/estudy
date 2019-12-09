'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema({
   name: {
      type: String,
      lowercase: true,
   },
   tsName: {
      type: String,
      required: true,
   },
   tsId: {
      type: Number,
   },
   dmlId: {
      type: Number,
   }
});

module.exports = mongoose.model('Guild', guildSchema);