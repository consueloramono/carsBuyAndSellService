const listingSchema = require("../models/listingSchema");
const profileService = require("../service/profileService");
const userSchema = require("../models/userSchema");

class ListingService {
  async createListing(body, userId) {
    if (!userId) {
      throw new Error("Невірний або прострочений токен");
    }

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
    } = body;

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

    return newListing;
  }

  async getListings() {
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

    return formattedListings;
  }

  async getListingById(id, refreshToken) {
    const listing = await listingSchema.findById(id);
    const userId = await profileService.getUserIdFromToken(refreshToken);
    if (!listing) {
      throw new Error("Оголошення не знайдено");
    }

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

    return responseData;
  }

  async updateListing(id, updatedData, userId) {
    const listing = await listingSchema.findById(id);

    if (!userId) {
      throw new Error("Невірний або прострочений токен");
    }

    if (!listing) {
      throw new Error("Оголошення не знайдено");
    }

    if (listing.publisher.toString() !== userId.toString()) {
      throw new Error("Доступ заборонено");
    }

    const updatedListing = await listingSchema.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    return updatedListing;
  }

  async deleteListing(id, userId) {
    const listing = await listingSchema.findById(id);

    if (!userId) {
      throw new Error("Невірний або прострочений токен");
    }

    if (!listing) {
      throw new Error("Оголошення не знайдено");
    }

    if (listing.publisher.toString() !== user._id.toString()) {
      throw new Error("Доступ заборонено");
    }

    await listingSchema.findByIdAndDelete(id);
  }
}

module.exports = new ListingService();
