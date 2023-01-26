const { Op } = require('sequelize');
const {
  FRIEND_ACCEPTED,
  STATUS_ME,
  STATUS_UNKNOWN,
  STATUS_FRIEND,
  STATUS_ACCEPTER,
  STATUS_REQUESTER
} = require('../config/constant');
const { User, Friend } = require('../models');
const createError = require('../utils/create-error');
const cloudinary = require('../utils/cloudinary');

exports.getUserInfoById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.userId
      },
      attributes: {
        exclude: ['password']
      }
    });

    if (!user) {
      createError('user with this id is not found', 400);
    }

    const userFriends = await Friend.findAll({
      where: {
        status: FRIEND_ACCEPTED,
        [Op.or]: [
          { requesterId: req.params.userId },
          { accepterId: req.params.userId }
        ]
      },
      include: [
        { model: User, as: 'Requester', attributes: { exclude: ['password'] } },
        { model: User, as: 'Accepter', attributes: { exclude: ['password'] } }
      ]
    });

    const friends = userFriends.map(el =>
      el.requesterId === +req.params.userId ? el.Accepter : el.Requester
    );

    let statusWithAuthUser;
    if (req.user.id === +req.params.userId) {
      statusWithAuthUser = STATUS_ME;
    } else {
      const existFriend = await Friend.findOne({
        where: {
          [Op.or]: [
            { requesterId: req.params.userId, accepterId: req.user.id },
            { requesterId: req.user.id, accepterId: req.params.userId }
          ]
        }
      });
      if (!existFriend) {
        statusWithAuthUser = STATUS_UNKNOWN;
      } else if (existFriend.status === FRIEND_ACCEPTED) {
        statusWithAuthUser = STATUS_FRIEND;
      } else if (existFriend.requesterId === req.user.id) {
        statusWithAuthUser = STATUS_ACCEPTER;
      } else {
        statusWithAuthUser = STATUS_REQUESTER;
      }
    }

    res.status(200).json({
      user,
      friends,
      statusWithAuthUser
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfileImage = async (req, res, next) => {
  try {
    console.log(req.files);
    await cloudinary.upload(req.files.profileImage[0].path);
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};
