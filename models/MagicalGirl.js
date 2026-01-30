const mongoose = require('mongoose');

const magicalGirlSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Magical girl name is required'],
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name must not exceed 50 characters']
    },
    soulGemColor: {
        type: String,
        required: [true, 'Soul gem color is required'],
        minlength: [2, 'Color must be at least 2 characters long'],
        maxlength: [30, 'Color must not exceed 30 characters']
    },
    weapon: {
        type: String,
        enum: {
            values: ['Bow', 'Spear', 'Sword', 'Gun', 'Shield', 'Other'],
            message: 'Weapon must be one of: Bow, Spear, Sword, Gun, Shield or Other'
        },
        required: [true, 'Weapon is required']
    },
    wish: {
        type: String,
        default: 'Not recorded',
        maxlength: [200, 'Wish must not exceed 200 characters']
    },
    isWitch: {
        type: Boolean,
        default: false
    },
    powerLevel: {
        type: Number,
        min: [1, 'Minimum power level is 1'],
        max: [100, 'Maximum power level is 100'],
        default: 10
    },
    contractDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MagicalGirl', magicalGirlSchema);
