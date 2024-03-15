const listingService = require("../service/listingService");

class ListingController {
  async createListing(req, res, next) {
    const { refreshToken } = req.cookies;

    try {
      const newListing = await listingService.createListing(
        req.body,
        refreshToken
      );

      res.status(201).json({ success: true, data: newListing });
    } catch (error) {
      console.log(error);
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
      console.log(error);
      res.status(500).json({
        success: false,
        error: "Помилка при отриманні списку оголошень",
      });
    }
  }

  async getListingById(req, res, next) {
    try {
      const { id } = req.params;
      const { refreshToken } = req.cookies;

      const responseData = await listingService.getListingById(
        id,
        refreshToken
      );

      res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      console.log(error);
      res.status(404).json({ success: false, error: "Оголошення не знайдено" });
    }
  }

  async updateListing(req, res, next) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const { refreshToken } = req.cookies;

      const updatedListing = await listingService.updateListing(
        id,
        updatedData,
        refreshToken
      );

      res.status(200).json({ success: true, data: updatedListing });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, error: "Помилка при оновленні оголошення" });
    }
  }

  async deleteListing(req, res, next) {
    try {
      const { id } = req.params;
      const { refreshToken } = req.cookies;

      await listingService.deleteListing(id, refreshToken);

      res
        .status(200)
        .json({ success: true, message: "Оголошення успішно видалено" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, error: "Помилка при видаленні оголошення" });
    }
  }
}

module.exports = new ListingController();
