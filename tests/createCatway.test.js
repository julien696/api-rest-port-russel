require('dotenv').config({path: '.env.test'});
const { createCatway } = require('../controllers/catwayController');
const Catway = require('../models/Catway');
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await Catway.deleteMany({});
});

afterEach(async () => {
    await Catway.deleteMany({});
});

test('Créer un catway', async () => {
    const req ={
        body: {
            catwayNumber: 1,
            type: 'court',
            catwayState: 'disponible',
        }
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await createCatway(req, res);

    const catway = await Catway.findOne({ catwayNumber: 1 });
    expect(catway).not.toBeNull();
    expect(catway.catwayNumber).toBe(1);
    expect(catway.type).toBe('court');
    expect(catway.catwayState).toBe('disponible');
    expect(res.redirect).toHaveBeenCalledWith('/dashboard?success=Catway créé avec succès');
})