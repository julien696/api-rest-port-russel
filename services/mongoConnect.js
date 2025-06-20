const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connexion à MongoDB réussi');
    } catch (error) {
        console.error('Erreur de connexion MongoDB');
        process.exit(1);
    }
};

module.exports = connectToMongo