require('dotenv').config();
const express = require('express'); 
const connectToMongo = require('./services/mongoConnect')
const app = express(); 
const port = process.env.PORT;
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');

connectToMongo();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/docs', express.static(path.join(__dirname, 'docs')));

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`)
});
 
