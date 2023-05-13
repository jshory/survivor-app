const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    owner: {
        required: true,
        type: String
    },
    season: {type: Schema.Types.ObjectId, ref: 'Season'},
    contestants: [{type: Schema.Types.ObjectId, ref: 'Contestant'}]
});

schema.set('timestamps', true);

module.exports = mongoose.model('Tribe', schema);