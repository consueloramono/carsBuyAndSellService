const listingService = require("../service/listingService");
const { getUserIdFromToken } = require("../service/profileService");
const { refresh } = require("./userController");

class ListingController {
  async createListing(req, res, next) {
    const userId = req.user.id;

    try {
      const newListing = await listingService.createListing(req.body, userId);

      res.status(201).json({ success: true, data: newListing });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Помилка при створенні оголошення" });
    }
  }

  async getListings(req, res, next) {
    try {
      const formattedListings = await listingService.getListings();

      res.status(200).json({ success: true, data: formattedListings });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Помилка при отриманні списку оголошень",
      });
    }
  }

  async getListingById(req, res, next) {
    try {
      const { id } = req.params;
      let { refreshToken } = req.cookies;

      const responseData = await listingService.getListingById(
        id,
        refreshToken
      );

      res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      res.status(404).json({ success: false, error: "Оголошення не знайдено" });
    }
  }

  async updateListing(req, res, next) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const userId = req.user.id;

      const updatedListing = await listingService.updateListing(
        id,
        updatedData,
        userId
      );

      res.status(200).json({ success: true, data: updatedListing });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Помилка при оновленні оголошення" });
    }
  }

  async deleteListing(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await listingService.deleteListing(id, userId);

      res
        .status(200)
        .json({ success: true, message: "Оголошення успішно видалено" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Помилка при видаленні оголошення" });
    }
  }
}

module.exports = new ListingController();
