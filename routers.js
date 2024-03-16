const express = require("express");
const UserController = require("./controllers/userController");
const profileController = require("./controllers/profileController");
const listingController = require("./controllers/listingController");
const authMiddleware = require("./middlewares/authMiddleware");
const router = express.Router();

router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/refresh", UserController.refresh);
router.post("/createProfile", authMiddleware, profileController.createProfile);
router.put("/updateProfile", authMiddleware, profileController.updateProfile);

router.post("/listings", authMiddleware, listingController.createListing);
router.get("/listings", listingController.getListings);
router.get("/listings/:id", listingController.getListingById);
router.put("/listings/:id", authMiddleware, listingController.updateListing);
router.delete("/listings/:id", authMiddleware, listingController.deleteListing);
module.exports = router;
