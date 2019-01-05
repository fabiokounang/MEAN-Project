const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');


router.post('/signup', (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt)
  })
  user.save().then((response) => {
    res.status(201).json({
      status: true,
      message: 'User successfully created !',
      data: response
    })
  }).catch((err) => {
    res.status(500).json({
      status: false,
      message: 'Cannot create user !',
      data: err
    })
  })
})

router.post('/login', (req, res, next) => {
  let user;
  User.findOne({
    email: req.body.email
  }).then((dataUser) => {
    if (!dataUser) {
      return res.status(500).json({
        status: false,
        code: 0,
        message: 'User not found',
        data: null
      })
    }
    user = dataUser;
    bcrypt.compare(req.body.password, dataUser.password).then((result) => {
      if (!result) {
        return res.status(500).json({
          status: false,
          code: 1,
          message: 'Password not found',
          data: null
        })
      }
      
      const token = jwt.sign({ id: user._id, email: user.email }, 'RAON_LEE_FEGGY_WIGUNA_KEI_TAKEBUCHI', { expiresIn: "1h" });
      
      res.status(200).json({
        status: true,
        code: 2,
        message: 'Login successful !',
        token: token,
        userId: user._id,
        expiresIn: 3600
      })
    }).catch((err) => {
      return res.status(500).json({
        status: false,
        code: 0,
        message: 'User not found',
        data: null
      })
    })
  })
})

module.exports = router;