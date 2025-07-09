require('dotenv').config({path: '.env.test'});
const { deleteCatway } = require('../controllers/catwayController');
const Catway = require('../models/Catway');
const mongoose = require('mongoose');

beforeAll( async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
});

afterAll( async () => {
    await mongoose.connection.close();
});

let catwayId;

beforeEach( async () => {
    await Catway.deleteMany({});
    const catway = await Catway.create({
        catwayNumber: 99,
        type: 'long',
        catwayState: 'disponible',
    });
    catwayId = catway._id;
});

afterEach( async () => {
    await Catway.deleteMany({});
});

test('Supprimer un catway', async () => {
    const req = {
        body: {id: catwayId}        
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await deleteCatway(req, res);

    const catway = await Catway.findById(catwayId);
    expect(catway).toBeNull();
    expect(res.redirect).toHaveBeenCalledWith('/dashboard?success=Catway supprimé');
})