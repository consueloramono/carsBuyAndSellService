const mongoose = require("mongoose");

const listingSchema = mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  carCondition: { type: String, required: true },
  photos: { type: [Buffer], required: true },
  location: { type: String, required: true },
  contactInformation: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  saleOrRentStatus: { type: String, required: true },
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

module.exports = mongoose.model("Listing", listingSchema);
