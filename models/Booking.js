const mongoose = required('mongoose');

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
    chekOut : {
        type : Date,
        required : true
    }
}, { timestamps : true });

module.exports = mongoose.model('Booking', bookingSchema);