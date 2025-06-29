require('dotenv').config();
const express = require('express'); 
const connectToMongo = require('./services/mongoConnect')
const app = express(); 
const port = process.env.PORT;
const path = require('path');
const indexRouter = require('./routes/index');
const cookieParser = require('cookie-parser');

connectToMongo();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', indexRouter);

app.get('/', (req, res) => {
    res.render('index')
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`)
});
 
