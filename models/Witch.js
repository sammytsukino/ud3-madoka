const mongoose = require('mongoose');

const witchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Witch name is required'],
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [60, 'Name must not exceed 60 characters']
    },
    barrierType: {
        type: String,
        enum: {
            values: ['Labyrinth', 'Pocket', 'Reality', 'Other'],
            message: 'Barrier type must be: Labyrinth, Pocket, Reality or Other'
        },
        required: [true, 'Barrier type is required']
    },
    dangerLevel: {
        type: Number,
        min: [1, 'Minimum danger level is 1'],
        max: [10, 'Maximum danger level is 10'],
        default: 5
    },
    defeated: {
        type: Boolean,
        default: false
    },
    magicalGirl: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MagicalGirl'
    },
    firstAppearance: {
        type: Date
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Witch', witchSchema);
