const express = require("express");
const router = express.Router();

const locationController = require("../controllers/locationController");

const { verifyToken } = require("../middleware/authMiddleware");

router.post("/create", verifyToken, locationController.createLocation);
router.post("/:location_id/regions", verifyToken, locationController.addRegion);
router.post("/:location_id/regions/:region_id/zones", verifyToken, locationController.addZone);
router.get("/all", verifyToken, locationController.getAllLocations);
router.put("/update/:location_id", verifyToken, locationController.updateLocation);
router.put("/update/:location_id/regions/:region_id", verifyToken, locationController.updateRegion);
router.put("/update/:location_id/regions/:region_id/zones/:zone_id", verifyToken, locationController.updateZone);

module.exports = router;
