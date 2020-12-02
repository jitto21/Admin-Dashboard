const mongoose = require('mongoose');

var busSchema = mongoose.Schema({
    from: {type:String, required: true},
    to: {type:String, required: true},
    type: {type:String, required: true},
    dep: {type:String, required: true},
    arr: {type:String, required: true},
    date: {type:String, required: true},
    ava: {type:String, required: true},
    fare: {type:Number, required: true},
    bookedSeats: {type:[Number], required: true}
})

module.exports = mongoose.model('Bus', busSchema)