require('dotenv').config();
const express = require('express'); 
const connectToMongo = require('./services/mongoConnect')
const app = express(); 
const port = process.env.PORT;

app.use(express.json());

connectToMongo(); 

app.get('/', (req, res) => {
    res.send('Hello world') 
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`)
});
 
