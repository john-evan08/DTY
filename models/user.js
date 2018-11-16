const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    bills:[{
        date: Date,
        description: String,
        value: Number
    }]
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByID= function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query,callback);
}

module.exports.addUser = function (newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err,hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err,isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
})}

module.exports.findBillbyID = function(id, bills){
    for (var i = 0; i < bills.length; i++){ 
        if (JSON.stringify(bills[i]['_id']) === JSON.stringify(id)){
            return i;
        }
    }
    return null;
}


