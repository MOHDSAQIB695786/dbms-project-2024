const mongoose = require('mongoose');

const canteenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    menu: [
        {
            dish: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ]
});

const Canteen = mongoose.model('Canteen', canteenSchema);

module.exports = Canteen;
