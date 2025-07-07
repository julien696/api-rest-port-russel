require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectToMongo = require('../services/mongoConnect');

async function userTest(email, name, password) {
    try {
        await connectToMongo();

        const user = new User({ name, email, password, });

        await user.save();
        console.log(`L'utilisateur ${user.name} créé avec succés`);
        process.exit();
    } catch(error) {
        console.error('Erreur création utilisateur:', error);
        process.exit(1);
    }
};

userTest('portRussel@gmail.com', 'Jack', 'portRussel123');