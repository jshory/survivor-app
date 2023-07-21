const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    season: {type: Schema.Types.ObjectId, ref: 'Season'}
});

schema.set('timestamps', true);

module.exports = mongoose.model('Contestant', schema);