const Location = require("../models/location");

exports.createLocation = async (req, res) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const exists = await Location.findOne({ location });
    if (exists) {
      return res.status(400).json({ message: "Location already exists" });
    }

    const newLocation = new Location({
      location,
      regions: [],
      created_by: req.user.user_id
    });

    await newLocation.save();

    res.status(201).json({
      message: "Location created successfully",
      location: newLocation
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addRegion = async (req, res) => {
  try {
    const { location_id } = req.params;
    const { region } = req.body;

    if (!region) {
      return res.status(400).json({ message: "Region is required" });
    }

    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const regionExists = location.regions.some(
      r => r.region.toLowerCase() === region.toLowerCase()
    );

    if (regionExists) {
      return res.status(400).json({ message: "Region already exists" });
    }

    location.regions.push({ region, zones: [] });
    location.updated_by = req.user.user_id;
    location.updated_at = new Date();

    await location.save();

    res.status(200).json({
      message: "Region added successfully",
      location
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addZone = async (req, res) => {
  try {
    const { location_id, region_id } = req.params;
    const { zone } = req.body;

    if (!zone) {
      return res.status(400).json({ message: "Zone is required" });
    }

    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const region = location.regions.id(region_id);
    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    const zoneExists = region.zones.some(
      z => z.zone.toLowerCase() === zone.toLowerCase()
    );

    if (zoneExists) {
      return res.status(400).json({ message: "Zone already exists" });
    }

    region.zones.push({ zone });
    location.updated_by = req.user.user_id;
    location.updated_at = new Date();

    await location.save();

    res.status(200).json({
      message: "Zone added successfully",
      location
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({ status: "active" })
      .select("-__v")
      .sort({ location: 1 });

    res.status(200).json({
      message: "Locations fetched successfully",
      locations
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { location_id } = req.params;
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ message: "Location name is required" });
    }

    // Check if location exists
    const existingLocation = await Location.findById(location_id);
    if (!existingLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Check uniqueness
    const duplicate = await Location.findOne({
      location: { $regex: `^${location}$`, $options: "i" },
      _id: { $ne: location_id }
    });

    if (duplicate) {
      return res.status(400).json({ message: "Location name already exists" });
    }

    existingLocation.location = location;
    existingLocation.updated_by = req.user.user_id;
    existingLocation.updated_at = new Date();

    await existingLocation.save();

    res.status(200).json({
      message: "Location updated successfully",
      location: existingLocation
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateRegion = async (req, res) => {
  try {
    const { location_id, region_id } = req.params;
    const { region } = req.body;

    if (!region) {
      return res.status(400).json({ message: "Region name is required" });
    }

    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const regionDoc = location.regions.id(region_id);
    if (!regionDoc) {
      return res.status(404).json({ message: "Region not found" });
    }

    // Check duplicate region name within same location
    const duplicate = location.regions.some(
      r =>
        r.region.toLowerCase() === region.toLowerCase() &&
        r._id.toString() !== region_id
    );

    if (duplicate) {
      return res.status(400).json({ message: "Region name already exists" });
    }

    regionDoc.region = region;
    location.updated_by = req.user.user_id;
    location.updated_at = new Date();

    await location.save();

    res.status(200).json({
      message: "Region updated successfully",
      location
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateZone = async (req, res) => {
  try {
    const { location_id, region_id, zone_id } = req.params;
    const { zone } = req.body;

    if (!zone) {
      return res.status(400).json({ message: "Zone name is required" });
    }

    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const region = location.regions.id(region_id);
    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    const zoneDoc = region.zones.id(zone_id);
    if (!zoneDoc) {
      return res.status(404).json({ message: "Zone not found" });
    }

    // Check duplicate zone within same region
    const duplicate = region.zones.some(
      z =>
        z.zone.toLowerCase() === zone.toLowerCase() &&
        z._id.toString() !== zone_id
    );

    if (duplicate) {
      return res.status(400).json({ message: "Zone name already exists" });
    }

    zoneDoc.zone = zone;
    location.updated_by = req.user.user_id;
    location.updated_at = new Date();

    await location.save();

    res.status(200).json({
      message: "Zone updated successfully",
      location
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
