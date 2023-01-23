module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      image: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      }
    },
    { underscored: true }
  );
  return Post;
};
