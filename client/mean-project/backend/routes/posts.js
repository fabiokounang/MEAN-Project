const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

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
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.get('', (req, res, next) => {
  let postData = null;
  const limit = +req.query.limit;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  if (limit && currentPage) {
    postQuery.skip(limit * (currentPage - 1)).limit(limit);
  }
  postQuery.find().then((results) => {
    postData = results;
    return Post.countDocuments();
  }).then((count) => {
    res.status(200).json({
      status: true,
      message: 'Post fetched successfully !',
      data: postData,
      total: count
    });
  })
});

router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  let post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: url + '/images/' + req.file.filename,
    creator: req.userData.id
  })
  
  post.save().then((result) => {
    res.status(201).json({
      status: true,
      message: 'Post Success !',
      data: result
    })
  })
})

router.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  let image = req.body.image;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    image = url + '/images/' + req.file.filename
  }
  const putEdit = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    image: image,
    creator: req.userData.id
  })
  
  Post.updateOne({
    _id: req.params.id,
    creator: req.userData.id
  }, putEdit).then((result) => {
    console.log(result, 'ini result')
    
    if (result.nModified < 1) {
      res.status(500).json({
        status: false,
        message: 'Not authorized !',
        data: result
      })
    } else {
      res.status(200).json({
        status: true,
        message: 'Update Successful !',
        data: result
      })
    }
  }).catch((err) => {
    res.status(500).json({
      status: false,
      message: 'Update failed !',
      data: err
    })
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

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.id
  }).then((result) => {
    if (result.n < 1) {
      res.status(500).json({
        status: false,
        message: 'Not authorized ! !',
        data: result
      })
    } else {
      res.status(200).json({
        status: true,
        message: 'Success delete data !',
        data: req.params.id
      })
    }
  }).catch((err) => {
    res.status(500).json({
      status: false,
      message: 'Delete failed !',
      data: err
    })
  })
})

module.exports = router;