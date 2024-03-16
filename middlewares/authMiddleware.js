const tokenService = require("../service/tokenService");

module.exports = async function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ error: "Не знайдено AccessToken" });
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return res.status(400).json({ error: "Не існуючий AccessToken" });
    }

    const userData = await tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return res.status(401).json({ error: "AccessToken не коректний" });
    }
    req.user = userData;
    next();
  } catch (error) {
    next(error);
  }
};
