const profileService = require("../service/profileService");

class ProfileController {
  async createProfile(req, res, next) {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res
          .status(401)
          .json({ error: "Невірний або прострочений токен" });
      }

      const profileData = req.body;
      const newProfile = await profileService.createProfile(
        userId,
        profileData
      );

      res.status(201).json({ profile: newProfile });
    } catch (error) {
      res.status(500).json({ error: "Помилка при створенні профілю" });
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res
          .status(401)
          .json({ error: "Невірний або прострочений токен" });
      }

      const profileData = req.body;
      const updatedProfile = await profileService.updateProfile(
        userId,
        profileData
      );

      res.status(200).json({ profile: updatedProfile });
    } catch (error) {
      res.status(500).json({ error: "Помилка при оновленні профілю" });
    }
  }
}

module.exports = new ProfileController();
