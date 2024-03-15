const listingSchema = require("../models/listingSchema");
const profileService = require("../service/profileService");
const userSchema = require("../models/userSchema");
class ListingController {
  async createListing(req, res, next) {
    const { refreshToken } = req.cookies;
    const userId = await profileService.getUserIdFromToken(refreshToken);

    if (!userId) {
      return res.status(401).json({ error: "Невірний або прострочений токен" });
    }
    try {
      const {
        make,
        model,
        year,
        price,
        description,
        carCondition,
        photos,
        location,
        contactInformation,
        saleOrRentStatus,
      } = req.body;

      const newListing = await listingSchema.create({
        make,
        model,
        year,
        price,
        description,
        carCondition,
        photos,
        location,
        contactInformation,
        saleOrRentStatus,
        publisher: userId,
      });

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
      const listings = await listingSchema.find();

      const formattedListings = listings.map((listing) => ({
        id: listing._id,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        photos: listing.photos,
        location: listing.location,
        saleOrRentStatus: listing.saleOrRentStatus,
      }));

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

      const listing = await listingSchema.findById(id);

      const { refreshToken } = req.cookies;
      const userId = await profileService.getUserIdFromToken(refreshToken);

      let responseData = {
        id: listing._id,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        photos: listing.photos,
        location: listing.location,
        saleOrRentStatus: listing.saleOrRentStatus,
      };

      if (userId) {
        responseData.publisher = listing.publisher.name;
        responseData.contactInformation = listing.contactInformation;
      }

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
      const userId = await profileService.getUserIdFromToken(refreshToken);
      const user = await userSchema.findById(userId);
      const listing = await listingSchema.findById(id);

      if (!userId || listing.publisher.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "Доступ заборонено" });
      }

      const updatedListing = await listingSchema.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
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
      const userId = await profileService.getUserIdFromToken(refreshToken);
      const user = await userSchema.findById(userId);
      const listing = await listingSchema.findById(id);

      if (!userId || listing.publisher.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "Доступ заборонено" });
      }

      await listingSchema.findByIdAndDelete(id);

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
