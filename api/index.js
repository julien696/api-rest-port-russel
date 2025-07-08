require('dotenv').config();
const express = require('express'); 
const connectToMongo = require('../services/mongoConnect')
const app = express(); 
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRouter = require('../routes/index');
const serverless = require('serverless-http');

connectToMongo();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views')); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/docs', express.static(path.join(process.cwd(), 'docs')));

module.exports = app;
module.exports.handler = serverless(app);
 
