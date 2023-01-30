const express = require('express');

const postController = require('../controllers/post-controller');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/', upload.single('postImage'), postController.createPost);
router.get('/friends', postController.getAllPostIncludeFriend);
router.delete('/:postId', postController.deletePost);

module.exports = router;
