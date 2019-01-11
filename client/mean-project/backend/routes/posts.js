const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

router.get('', postController.getAllData);
router.post('', checkAuth, extractFile, postController.postData)
router.put('/:id', checkAuth, extractFile, postController.updateData)
router.get('/:id', postController.getDataById)
router.delete('/:id', checkAuth, postController.deleteData)

module.exports = router;