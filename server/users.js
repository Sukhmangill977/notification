const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    subscription: Object
});

module.exports = mongoose.model('users', usersSchema);
