const express = require('express');

const friendController = require('../controllers/friend-controller');

const router = express.Router();

router.post('/:userId', friendController.requestFriend);
router.patch('/:requesterId', friendController.acceptFriend);

module.exports = router;
