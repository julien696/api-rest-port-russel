require('dotenv').config({path: '.env.test'});
const { partialUpdateCatway } = require('../controllers/catwayController');
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
        catwayNumber: 100,
        type: 'short',
        catwayState: 'disponible',
    });
    catwayId = catway._id;
});

afterEach( async () => {
    await Catway.deleteMany({});
});

test(`Modifier l'état d'un catway`, async () => {
    const req = {
        body: {
           id: catwayId,
           catwayState: 'indisponible' 
        }
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await partialUpdateCatway(req, res);

    const catway = await Catway.findOne({catwayNumber: 100});
    expect(catway).not.toBeNull();
    expect(catway.catwayState).toBe('indisponible');
    expect(res.redirect).toHaveBeenCalledWith('/dashboard?success=Catway partiellement modifié');
})