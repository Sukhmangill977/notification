const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    subscription: Object
});

module.exports = mongoose.model('User', userSchema);
