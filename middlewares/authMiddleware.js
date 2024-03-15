const tokenService = require("../service/tokenService");

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.json(`Не знайдено AccessToken`);
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return res.json(`Не існуючий AccessToken`);
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return res.json(`AccessToken не коректний`);
    }
    req.user = userData;
    next();
  } catch (error) {
    res.json(`Помилка: ${error}`);
  }
};
