const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
    fname: {type: String, required: true},
    mname: {type: String},
    lname: {type: String, required: true},
    empid: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    uname: {type: String, required: true, unique: true},
    pass: {type: String, required: true},
    gender: {type: String, required: true},
    doj: {type: Date, required: true},
    designation: {type: String, required: true},
    phone: {type: Number, required: true},
    altPhone: {type: Number},
    access : {type: Object}
})

userSchema.plugin(uniqueValidator, {message: 'This Account exists'});
module.exports = mongoose.model('User', userSchema)