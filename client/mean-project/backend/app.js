const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const path = require('path');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

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
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request, Accept', 'Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
})

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

module.exports = app;