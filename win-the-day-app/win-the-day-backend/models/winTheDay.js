const mongoose = require('mongoose');

const winTheDaySchema = new mongoose.Schema({
    name: String,
    tasks: [String],
    tasksCompleted: [Boolean],
    reflection: {type: String, default: ""},
    additionalNotes: {type: String, default: ""},
    winStatus: {type: Boolean, default: false}
});

module.exports = mongoose.model('winTheDay', winTheDaySchema);
