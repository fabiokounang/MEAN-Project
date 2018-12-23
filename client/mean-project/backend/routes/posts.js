const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    callback(error, 'backend/images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    console.log(name, ext)
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.get('', (req, res, next) => {
  const limit = +req.query.limit;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  if (limit && currentPage) {
    postQuery.skip(limit * (currentPage - 1)).limit(limit);
  }
    postQuery.find().then((results) => {
      res.status(200).json({
        status: true,
        message: 'Post fetched successfully !',
        data: results
      });
    }).catch((err) => {
      console.log(err);
    })
});

router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  let post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: url + '/images/' + req.file.filename
  })
  post.save().then((result) => {
    res.status(201).json({
      status: true,
      message: 'Post Success !',
      data: result
    })
  })
})

router.put('/:id', multer({storage: storage}).single('image'), (req, res, next) => {
  let image = req.body.image;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    image = url + '/images/' + req.file.filename
  }
  const postEdit = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    image: image
  })
  
  Post.updateOne({
    _id: req.params.id
  }, postEdit).then((result) => {
    res.status(200).json({
      status: true,
      message: 'Update Successfull !',
      data: result
    })
  }).catch((err) => {
    console.log(err);
  })
})

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then((result) => {
    if (result) {
      res.status(200).json({
        status: true,
        message: 'One Post fetched successfully !',
        data: result
      })
    } else {
      res.status(404).json({
        status: false,
        message: 'Failed fetch one post !',
        data: null
      })
    }
  }).catch((err) => {
    console.log(err);
  })
})

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then((result) => {
    res.status(200).json({
      status: true,
      message: 'Success delete data !',
      data: req.params.id
    })
  }).catch((err) => {
    console.log(err);
  })
})

module.exports = router;