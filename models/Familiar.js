const mongoose = require('mongoose');

const familiarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Familiar name is required'],
        minlength: [1, 'Name must be at least 1 character long'],
        maxlength: [40, 'Name must not exceed 40 characters']
    },
    witch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Witch',
        required: [true, 'Familiar must belong to a witch']
    },
    type: {
        type: String,
        enum: {
            values: ['Minion', 'Elite', 'Boss', 'Other'],
            message: 'Type must be: Minion, Elite, Boss or Other'
        },
        required: [true, 'Familiar type is required']
    },
    strength: {
        type: Number,
        min: [0, 'Minimum strength is 0'],
        max: [100, 'Maximum strength is 100'],
        default: 5
    },
    isEvolved: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Familiar', familiarSchema);
