require('dotenv').config({path: '.env.test'});
const { deleteUser } = require('../controllers/userController');
const User = require('../models/User');;
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
});

afterAll(async () => {
    await mongoose.connection.close();
});

let userId;

beforeEach(async ()=> {
    await User.deleteMany({});
    const user = await User.create({
        name: 'Tom Platz',
        email: 'tomplatz@gmail.com',
        password: '1234'
    });
    userId = user._id;
});

afterEach(async () => {
    await User.deleteMany({});
});

test('Supprimer un utilisateur', async ()=> {
    const req = {
        body: { id: userId },
        user: { id: userId },
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    await deleteUser(req, res);

    const user = await User.findById(userId);
    expect(user).toBeNull();
   expect(res.render).toHaveBeenCalledWith(
        'dashboard',
        expect.objectContaining({
            user: req.user,
            id: req.user.id,
            successMsg: expect.stringContaining('supprimé')
        })
    );
})