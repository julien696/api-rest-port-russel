require('dotenv').config({path: '.env.test'});
const { deleteBooking } = require('../controllers/bookingController');
const Catway = require('../models/Catway');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

beforeAll( async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
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

test('Supprimer une réservation', async () => {
    const catway = await Catway.create({
        catwayNumber: 333,
        type:'long',
        catwayState: 'disponible'
    });

    const booking = await Booking.create({
        catwayNumber: catway.catwayNumber,
        clientName: 'Johnny',
        boatName: 'Marie',
        checkIn: '2023-02-25',
        checkOut: '2023-03-12',
    });

    const req = {
        body: {id: booking._id}
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await deleteBooking(req, res);
    const deletedBooking = await Booking.findOne({clientName: 'Johnny'});

    expect(deletedBooking).toBeNull();
})