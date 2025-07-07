const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    catwayNumber : {
        type : Number,
        required : true
    },
    clientName : {
        type : String,
        required : true
    },
    boatName : {
        type : String,
        required : true
    },
    checkIn : {
        type : Date,
        required : true
    },
    checkOut : {
        type : Date,
        required : true
    }
}, { timestamps : true,
    collection: 'reservations'
 });

module.exports = mongoose.model('Booking', bookingSchema);