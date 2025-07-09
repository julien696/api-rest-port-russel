require('dotenv').config({ path: '.env.test' });
const { createBooking } = require('../controllers/bookingController');
const Booking = require('../models/Booking');
const Catway = require('../models/Catway');
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
});

afterAll( async () => {
    await mongoose.connection.close();
});

beforeEach( async () => {
    await Booking.deleteMany({});
    await Catway.deleteMany({});
});

afterEach( async () => {
    await Booking.deleteMany({});
    await Catway.deleteMany({});
});

test('Créer une réservation', async () => {

    const catway = await Catway.create({
        catwayNumber: 222,
        type: 'short',
        catwayState: 'disponible',
    });
  

    const req = {
        body: {
            catwayNumber: catway.catwayNumber,
            clientName: 'Jack',
            boatName: 'Black Pearl',
            checkIn: '2025-01-24',
            checkOut: '2025-02-10',
        }
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await createBooking(req, res);

    const booking = await Booking.findOne({boatName: 'Black Pearl'});
    expect(booking).not.toBeNull();
    expect(booking.catwayNumber).toBe(222);
    expect(booking.clientName).toBe('Jack');
    expect(res.redirect).toHaveBeenCalledWith('/dashboard?success=Réservation enregistrée')
})