const express = require("express");
const UserController = require("./controllers/userController");
const profileController = require("./controllers/profileController");
const listingController = require("./controllers/listingController");
const router = express.Router();

router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/refresh", UserController.refresh);
router.post("/createProfile", profileController.createProfile);
router.put("/editProfile", profileController.updateProfile);

router.post("/listings", listingController.createListing);
router.get("/listings", listingController.getListings);
router.get("/listings/:id", listingController.getListingById);
router.put("/listings/:id", listingController.updateListing);
router.delete("/listings/:id", listingController.deleteListing);
module.exports = router;
