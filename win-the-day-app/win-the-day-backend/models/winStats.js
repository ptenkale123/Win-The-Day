const mongoose = require('mongoose');

const winStatsSchema = new mongoose.Schema({
    name: String,
    numWins: Number,
    numLosses: Number,
    numDays: Number
});

module.exports = mongoose.model('winStats', winStatsSchema);