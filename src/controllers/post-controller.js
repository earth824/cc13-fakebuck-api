const fs = require('fs');
const { validateCreatePost } = require('../validators/post-validators');
const cloudinary = require('../utils/cloudinary');
const { Post } = require('../models');

exports.createPost = async (req, res, next) => {
  try {
    const value = validateCreatePost({
      title: req.body.title,
      image: req.file?.path
    });

    if (value.image) {
      value.image = await cloudinary.upload(value.image);
    }

    value.userId = req.user.id;

    const post = await Post.create(value);
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
