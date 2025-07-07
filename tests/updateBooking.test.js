require('dotenv').config({path: '.env.test'});
const { updatebooking, updateBooking } = require('../controllers/bookingController');
const Catway = require('../models/Catway');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

beforeAll( async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll( async () => {
    await mongoose.connection.close();
});

beforeEach( async () => {
    await Catway.deleteMany({});
    await Booking.deleteMany({});
});

afterEach( async () => {
    await Catway.deleteMany({});
    await Booking.deleteMany({});  
});

test('Modifier une réservation', async () => {

    const catway = await Catway.create({
        catwayNumber: 142,
        type: 'long',
        catwayState: 'Noyé'
    });


    const booking = await Booking.create({
        catwayNumber: catway.catwayNumber,
        clientName: 'Davy Jones',
        boatName: 'Hollandais Volant',
        checkIn: '2025-01-01',
        checkOut: '2025-01-15',
    });


    const req = {
        body: {
            id: booking._id,
            clientName: 'Will Turner',
            boatName: 'Hollandais Volant 2',
            checkIn: '2025-02-15',
            checkOut: '2025-03-16',
        }
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await updateBooking(req, res);
    const newBooking = await Booking.findOne({clientName: 'Will Turner'});
    
    expect(newBooking).not.toBeNull();
    expect(newBooking.boatName).toBe('Hollandais Volant 2');
    expect(res.redirect).toHaveBeenCalledWith('/dashboard?success=Réservation modifiée');
})