const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const path = require('path');
const routes = require('./routes/posts');

mongoose.connect('mongodb+srv://fabio:fabio@mean-kjgds.mongodb.net/MEAN?retryWrites=true', { useNewUrlParser: true }).then(() => {
  console.log('CONNECTED TO DATABASE');
}).catch((err) => {
  console.log('CONNECTION FAILED', err);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
})

app.use('/api/posts', routes);

module.exports = app;