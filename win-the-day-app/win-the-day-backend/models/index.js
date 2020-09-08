const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/win-the-day-app", {
  // connecting to the mongodb database name: "win-the-day-app" locally
  keepAlive: true, // keeping the connection alive
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("debug", true) // enabling debugging information to be printed to the console for debugging purposes

const winTheDay = require('./winTheDay');
const winStats = require('./winStats');

module.exports.winTheDay = winTheDay;
module.exports.winStats = winStats;
