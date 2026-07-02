const ErrorApi = require('../error/ErrorApi');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['x-sync-token'];

    if (authHeader === process.env.SYNC_SECRET_TOKEN) {
      return next();
    }
    console.log('Не вірний пароль');
    next(ErrorApi.noAuth('Не вірний пароль.'));
  } catch (err) {
    console.log('Помилка в IsFromBaylap', err);
    return next(ErrorApi.badRequest(err));
  }
};
