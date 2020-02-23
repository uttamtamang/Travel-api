const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    image: {
        type: String
    },
    packagename: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    duration: {
        type: String
    },
    participants: {
        type: String
    },
    desc: {
        type: String
    },
    heighlight1: {
        type: String,
    },
    heighlight2: {
        type: String,
    },
    heighlight3: {
        type: String,
    },
    transportation: {
        type: String
    },
    phone: {
        type: String
    },
    tAgency: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    name: {
        type: String
    }
});

module.exports = mongoose.model('Package', packageSchema);
