require('dotenv').config({path: '.env.test'});
const { updateCatway } = require('../controllers/catwayController');
const Catway = require('../models/Catway');
const mongoose = require('mongoose');

beforeAll( async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll( async () => {
    await mongoose.connection.close();
});

let catwayId;

beforeEach( async () => {
    await Catway.deleteMany({});
    const catway = await Catway.create({
        catwayNumber: 200,
        type: 'long',
        catwayState: 'disponible',
    });
    catwayId = catway._id
});

afterEach( async () => {
    await Catway.deleteMany({});
});

test('Modifier un catway', async () => {
    const req = {
        body: {
            id: catwayId,
            catwayNumber: 150,
            type: 'short',
            catwayState:'cool',
        }
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await updateCatway(req, res);

    const catway = await Catway.findOne({catwayNumber: 150});
    expect(catway).not.toBeNull();
    expect(catway.catwayNumber).toBe(150);
    expect(catway.type).toBe('short');
    expect(catway.catwayState).toBe('cool');
    expect(res.redirect).toHaveBeenCalledWith('/dashboard?success=Catway modifié avec succès');
})