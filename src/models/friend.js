const { FRIEND_ACCEPTED, FRIEND_PENDING } = require('../config/constant');

module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    'Friend',
    {
      status: {
        type: DataTypes.ENUM(FRIEND_PENDING, FRIEND_ACCEPTED),
        allowNull: false,
        defaultValue: FRIEND_PENDING
      }
    },
    { underscored: true }
  );
  return Friend;
};
