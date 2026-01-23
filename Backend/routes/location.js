const express = require("express");
const router = express.Router();

const locationController = require("../controllers/locationController");
const { verifyToken } = require("../middleware/authMiddleware");

// Create
router.post("/create", verifyToken, locationController.createLocation);
router.post("/:location_id/regions", verifyToken, locationController.addRegion);
router.post("/:location_id/regions/:region_id/zones", verifyToken, locationController.addZone);

// Read
router.get("/all", verifyToken, locationController.getAllLocations);

// Update
router.put("/update/:location_id", verifyToken, locationController.updateLocation);
router.put("/update/:location_id/regions/:region_id", verifyToken, locationController.updateRegion);
router.put("/update/:location_id/regions/:region_id/zones/:zone_id", verifyToken, locationController.updateZone);

// Delete
router.delete("/delete/:location_id", verifyToken, locationController.deleteLocation);
router.delete("/:location_id/regions/delete/:region_id", verifyToken, locationController.deleteRegion);
router.delete("/:location_id/regions/:region_id/zones/delete/:zone_id", verifyToken, locationController.deleteZone);

module.exports = router;
