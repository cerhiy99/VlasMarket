const jwt = require('jsonwebtoken');
const ErrorApi = require('../error/ErrorApi');
const { Users } = require('../models/models');
const { literal } = require('sequelize');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ErrorApi.noAuth('Ви не авторизовані.'));
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findByPk(decoded.id);
    if (!user) {
      return next(ErrorApi.noAuth('Користувача не знайдено.'));
    }

    if (
      user.passwordUpdatedAt &&
      decoded.iat * 1000 < user.passwordUpdatedAt.getTime()
    ) {
      return next(
        ErrorApi.noAuth('Пароль був змінений після створення токена.'),
      );
    }

    await Users.update(
      { latestActivity: literal('NOW()') },
      { where: { id: decoded.id } },
    );

    if (user.adminAccess != 'user') {
      next();
    } else {
      return ErrorApi.badRequest('Не достатньо прав');
    }
  } catch (err) {
    return next(ErrorApi.noAuth('Токен протермінований або недійсний.'));
  }
};
