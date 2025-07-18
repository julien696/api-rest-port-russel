require('dotenv').config({ path: '.env.test' });
const { createUser } = require('../controllers/userController');
const User = require('../models/User');
const mongoose = require('mongoose');


beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await User.deleteMany({});
});

afterEach(async () => {
    await User.deleteMany({});
});

test('Créer un utilisateur', async () => {
    const req = {
        body:{
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '123456'
        }
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    await createUser(req, res);

    const user = await User.findOne({ email: 'johndoe@gmail.com' });
    expect(user).not.toBeNull();
    expect(user.name).toBe('John Doe');

    expect(res.redirect).toHaveBeenCalledWith('/dashboard?success=Utilisateur créé avec succès');
});