require('dotenv').config({path: '.env.test'});
const { getCatwayById } = require('../controllers/catwayController');
const Catway = require('../models/Catway');
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
});

afterAll(async () => {
    await mongoose.connection.close();
});

let catwayId;

beforeEach(async () => {
    await Catway.deleteMany({});
    const catway = await Catway.create({
        catwayNumber: 2,
        type: 'short',
        catwayState: 'disponible',
    });
    catwayId = catway._id;
});

afterEach(async () => {
    await Catway.deleteMany({});
});

test('Récupérer un catway par son Id', async () => {    
    const req = {
        params: { id: catwayId },
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    await getCatwayById(req, res);

    const catway = await Catway.findById(catwayId);

    expect(catway).not.toBeNull();
    expect(res.render).toHaveBeenCalledWith('catway', {
        title: `Détail du catway ${catway.catwayNumber}`,
        catway,
    });
});