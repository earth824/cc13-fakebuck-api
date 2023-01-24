const chalk = require('chalk');

module.exports = (err, req, res, next) => {
  console.log(chalk.redBright.bold.italic(err));

  if (err.name === 'ValidationError') {
    err.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({ message: err.message });
};
