const tokenService = require("./tokenService");
const profileSchema = require("../models/profileSchema");
const userSchema = require("../models/userSchema");

class ProfileService {
  async getUserIdFromToken(refreshToken) {
    const userData = await tokenService.validateRefreshToken(refreshToken);
    return userData ? userData.id : null;
  }

  async createProfile(userId, profileData) {
    const existingProfile = await profileSchema.findOne({ userId });

    if (existingProfile) {
      throw new Error("Профіль вже існує для цього користувача");
    }

    const newProfile = await profileSchema.create({ ...profileData, userId });
    return newProfile;
  }

  async updateProfile(userId, profileData) {
    const existingProfile = await profileSchema.findOne({ userId });

    if (!existingProfile) {
      throw new Error("Профіль не знайдено для цього користувача");
    }

    existingProfile.name = profileData.name || existingProfile.name;
    existingProfile.email = profileData.email || existingProfile.email;
    existingProfile.phoneNumber =
      profileData.phoneNumber || existingProfile.phoneNumber;
    existingProfile.age = profileData.age || existingProfile.age;
    existingProfile.imgLink = profileData.imgLink || existingProfile.imgLink;

    await existingProfile.save();

    return existingProfile;
  }
}

module.exports = new ProfileService();
