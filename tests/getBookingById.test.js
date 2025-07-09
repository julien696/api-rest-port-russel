require('dotenv').config({path: '.env.test'});
const { getBookingById } = require('../controllers/bookingController');
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
})

test('Récupérer une réservation par son id', async () => {
    let catwayId;

    const catway = await Catway.create({
        catwayNumber: 65,
        type: 'long',
        catwayState: 'disponible',
    });
        catwayId = catway._id;

    const booking = await Booking.create({
        catwayNumber: catway.catwayNumber,
        clientName: 'John Cena',
        boatName: 'melody',
        checkIn: '2025-11-01',
        checkOut: '2025-11-15',
    });

    const req = {
        params: { id: booking._id }
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await getBookingById(req, res);

    expect(res.render).toHaveBeenCalledWith(
        'booking',
        expect.objectContaining({
            title: `Détail de la réservation de ${booking.clientName} - catway n°${catway.catwayNumber}`,
        })
    );
})