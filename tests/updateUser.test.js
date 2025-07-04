require('dotenv').config({path: '.env.test'});
const { updateUser } = require('../controllers/userController');
const User = require('../models/User');
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

let userId;

beforeEach(async () => {
    await User.deleteMany({});
    const user = await User.create({
        name: 'Mark Henry',
        email: 'markhenry@gmail.com',
        password:'12345',
    });
    userId = user._id;
});

afterEach(async () => {
    await User.deleteMany({});
});

test('Mettre à jour un utilisateur', async () => {
    const req = {
        body: {
            id: userId,
            newName: 'Mac Lovin',
            newEmail: 'maclovin@gmail.com',
            newPassword: '123'
        },
        user: { id: userId}
    };

    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    await updateUser(req, res);

    const user = await User.findOne({email: 'maclovin@gmail.com'});
    expect(user).not.toBeNull();
    expect(user.name).toBe('Mac Lovin');
    expect(res.render).toHaveBeenCalledWith('dashboard', {
            user: req.user,
            id: req.user.id,
            successMsg: `Utilisateur ${userId} modifié avec succès`,
            error: null,
            catway: null 
        });
})
