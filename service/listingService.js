const listingSchema = require("../models/listingSchema");
const profileService = require("../service/profileService");
const userSchema = require("../models/userSchema");

class ListingService {
  async createListing(body, refreshToken) {
    const userId = await profileService.getUserIdFromToken(refreshToken);

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

  async updateListing(id, updatedData, refreshToken) {
    const userId = await profileService.getUserIdFromToken(refreshToken);
    const user = await userSchema.findById(userId);
    const listing = await listingSchema.findById(id);

    if (!userId || listing.publisher.toString() !== user._id.toString()) {
      throw new Error("Доступ заборонено");
    }

    const updatedListing = await listingSchema.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    return updatedListing;
  }

  async deleteListing(id, refreshToken) {
    const userId = await profileService.getUserIdFromToken(refreshToken);
    const user = await userSchema.findById(userId);
    const listing = await listingSchema.findById(id);

    if (!userId || listing.publisher.toString() !== user._id.toString()) {
      throw new Error("Доступ заборонено");
    }

    await listingSchema.findByIdAndDelete(id);
  }
}

module.exports = new ListingService();
