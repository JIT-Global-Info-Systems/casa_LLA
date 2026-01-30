import React, { createContext, useContext, useState, useCallback } from 'react';
import { locationsAPI, typesAPI, stagesAPI } from '@/services/api';
 
const MasterContext = createContext();
 
export const useMaster = () => {
  const context = useContext(MasterContext);
  if (!context) {
    throw new Error('useMaster must be used within a MasterProvider');
  }
  return context;
};
 
export const MasterProvider = ({ children }) => {
  // Single source of truth for all masters data
  const [masters, setMasters] = useState({
    locations: [],
    regions: [],
    zones: [],
    types: [],
    stages: [],
  });
 
  const [loading, setLoading] = useState({
    locations: false,
    regions: false,
    zones: false,
    types: false,
    stages: false,
  });
 
  const [error, setError] = useState({
    locations: null,
    regions: null,
    zones: null,
    types: null,
    stages: null,
  });
 
  // Fetch locations from API
  const fetchLocations = useCallback(async () => {
    setLoading(prev => ({ ...prev, locations: true, regions: true, zones: true }));
    setError(prev => ({ ...prev, locations: null, regions: null, zones: null }));
    try {
      const locationsData = await locationsAPI.getAll();
      // Transform API data to match component structure
      const transformedLocations = locationsData.map(loc => ({
        id: loc._id,
        name: loc.location,
        status: loc.status,
        regions: loc.regions || [],
        created_by: loc.created_by,
        created_at: loc.created_at,
        updated_at: loc.updated_at,
        updated_by: loc.updated_by
      }));
     
      // Extract regions and zones from locations data
      const transformedRegions = [];
      const transformedZones = [];
     
      locationsData.forEach(location => {
        if (location.regions && location.regions.length > 0) {
          location.regions.forEach(region => {
            transformedRegions.push({
              id: region._id,
              location: location.location,
              region: region.region,
              zones: region.zones || []
            });
           
            if (region.zones && region.zones.length > 0) {
              region.zones.forEach(zone => {
                transformedZones.push({
                  id: zone._id,
                  location: location.location,
                  region: region.region,
                  zone: zone.zone
                });
              });
            }
          });
        }
      });
     
      setMasters(prev => ({
        ...prev,
        locations: transformedLocations,
        regions: transformedRegions,
        zones: transformedZones
      }));
    } catch (err) {
      setError(prev => ({
        ...prev,
        locations: err.message,
        regions: err.message,
        zones: err.message
      }));
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(prev => ({ ...prev, locations: false, regions: false, zones: false }));
    }
  }, []);
 
  // Fetch types from API
  const fetchTypes = useCallback(async () => {
    setLoading(prev => ({ ...prev, types: true }));
    setError(prev => ({ ...prev, types: null }));
    try {
      const typesData = await typesAPI.getAll();
      // Transform API data to match component structure
      const transformedTypes = typesData.map(type => ({
        id: type._id,
        name: type.type,
        status: type.status,
        created_by: type.created_by,
        created_at: type.created_at,
        updated_at: type.updated_at,
        updated_by: type.updated_by
      }));
     
      setMasters(prev => ({ ...prev, types: transformedTypes }));
    } catch (err) {
      setError(prev => ({ ...prev, types: err.message }));
      console.error('Failed to fetch types:', err);
    } finally {
      setLoading(prev => ({ ...prev, types: false }));
    }
  }, []);
 
  // Fetch stages from API
  const fetchStages = useCallback(async () => {
    setLoading(prev => ({ ...prev, stages: true }));
    setError(prev => ({ ...prev, stages: null }));
    try {
      const stagesData = await stagesAPI.getAll();
      // Transform API data to match component structure
      const transformedStages = stagesData.map(stage => ({
        id: stage._id,
        name: stage.stage_name,
        stage_id: stage.stage_id,
        status: 'active', // Default status since API doesn't provide it
        created_by: stage.created_by,
        created_at: stage.created_at,
        updated_at: stage.updated_at,
        updated_by: stage.updated_by
      }));
     
      setMasters(prev => ({ ...prev, stages: transformedStages }));
    } catch (err) {
      setError(prev => ({ ...prev, stages: err.message }));
      console.error('Failed to fetch stages:', err);
    } finally {
      setLoading(prev => ({ ...prev, stages: false }));
    }
  }, []);
 
  // Fetch all data
  const fetchAllData = useCallback(async () => {
    await Promise.all([fetchLocations(), fetchTypes(), fetchStages()]);
  }, [fetchLocations, fetchTypes, fetchStages]);
 
  // API-based CRUD operations for locations
  const addLocation = useCallback(async (data) => {
    try {
      const locationData = { location: data.name };
      const response = await locationsAPI.create(locationData);
      console.log('Location created successfully:', response);
      // Refresh locations after successful creation
      await fetchLocations();
      return { success: true };
    } catch (err) {
      console.error('Failed to create location:', err);
      setError(prev => ({ ...prev, locations: err.message }));
      return { success: false, error: err.message };
    }
  }, [fetchLocations]);
 
  const updateLocation = useCallback(async (itemId, data) => {
    try {
      const locationData = { location: data.name };
      await locationsAPI.update(itemId, locationData);
      // Refresh locations after successful update
      await fetchLocations();
      return { success: true };
    } catch (err) {
      console.error('Failed to update location:', err);
      setError(prev => ({ ...prev, locations: err.message }));
      return { success: false, error: err.message };
    }
  }, [fetchLocations]);
 
  const deleteLocation = useCallback(async (itemId) => {
    try {
      await locationsAPI.delete(itemId);
      // Refresh locations after successful deletion
      await fetchLocations();
      return { success: true };
    } catch (err) {
      console.error('Failed to delete location:', err);
      setError(prev => ({ ...prev, locations: err.message }));
      return { success: false, error: err.message };
    }
  }, [fetchLocations]);
 
  // API-based CRUD operations for regions
  const addRegion = useCallback(async (data) => {
    try {
      // Find the location ID from the location name
      const location = masters.locations.find(loc => loc.name === data.location);
      if (!location) {
        throw new Error('Location not found');
      }
     
      const regionData = { region: data.region };
      const response = await locationsAPI.addRegion(location.id, regionData);
      console.log('Region created successfully:', response);
      // Refresh data after successful creation
      await fetchLocations();
      return { success: true };
    } catch (err) {
      console.error('Failed to create region:', err);
      setError(prev => ({ ...prev, regions: err.message }));
      return { success: false, error: err.message };
    }
  }, [masters.locations, fetchLocations]);
 
  const updateRegion = useCallback(async (itemId, data) => {
    try {
      // Find the location and region IDs
      const location = masters.locations.find(loc => loc.name === data.location);
      const region = masters.regions.find(r => r.id === itemId);
     
      if (!location || !region) {
        throw new Error('Location or region not found');
      }
     
      const regionData = { region: data.region };
      await locationsAPI.updateRegion(location.id, region.id, regionData);
      // Refresh data after successful update
      await fetchLocations();
      return { success: true };
    } catch (err) {
      console.error('Failed to update region:', err);
      setError(prev => ({ ...prev, regions: err.message }));
      return { success: false, error: err.message };
    }
  }, [masters.locations, masters.regions, fetchLocations]);
 
  const deleteRegion = useCallback(async (itemId) => {
    try {
      // Find the location and region IDs
      const region = masters.regions.find(r => r.id === itemId);
      const location = masters.locations.find(loc => loc.name === region.location);
     
      if (!location || !region) {
        throw new Error('Location or region not found');
      }
     
      await locationsAPI.deleteRegion(location.id, region.id);
      // Refresh data after successful deletion
      await fetchLocations();
      return { success: true };
    } catch (err) {
      console.error('Failed to delete region:', err);
      setError(prev => ({ ...prev, regions: err.message }));
      return { success: false, error: err.message };
    }
  }, [masters.regions, masters.locations, fetchLocations]);
 
  // API-based CRUD operations for zones
  const addZone = useCallback(async (data) => {
    try {
      // Find the location and region IDs
      const location = masters.locations.find(loc => loc.name === data.location);
      const region = masters.regions.find(r => r.region === data.region && r.location === data.location);
     
      if (!location) {
        throw new Error('Location not found');
      }
      if (!region) {
        throw new Error('Region not found');
      }
     
      const zoneData = { zone: data.zone };
      const response = await locationsAPI.addZone(location.id, region.id, zoneData);
      console.log('Zone created successfully:', response);
      // Refresh data after successful creation
      await fetchLocations();
      return { success: true };
    } catch (err) {
      console.error('Failed to create zone:', err);
      setError(prev => ({ ...prev, zones: err.message }));
      return { success: false, error: err.message };
    }
  }, [masters.locations, masters.regions, fetchLocations]);
 
  const updateZone = useCallback(async (itemId, data) => {
    try {
      // Find the location, region, and zone IDs
      const location = masters.locations.find(loc => loc.name === data.location);
      const region = masters.regions.find(r => r.region === data.region && r.location === data.location);
      const zone = masters.zones.find(z => z.id === itemId);
     
      if (!location || !region || !zone) {
        throw new Error('Location, region, or zone not found');
      }
     
      const zoneData = { zone: data.zone };
      await locationsAPI.updateZone(location.id, region.id, zone.id, zoneData);
      // Refresh data after successful update
      await fetchLocations();
      return { success: true };
    } catch (err) {
      console.error('Failed to update zone:', err);
      setError(prev => ({ ...prev, zones: err.message }));
      return { success: false, error: err.message };
    }
  }, [masters.locations, masters.regions, masters.zones, fetchLocations]);
 
  const deleteZone = useCallback(async (itemId) => {
    try {
      // Find the location, region, and zone IDs
      const zone = masters.zones.find(z => z.id === itemId);
      const region = masters.regions.find(r => r.region === zone.region && r.location === zone.location);
      const location = masters.locations.find(loc => loc.name === zone.location);
     
      if (!location || !region || !zone) {
        throw new Error('Location, region, or zone not found');
      }
     
      await locationsAPI.deleteZone(location.id, region.id, zone.id);
      // Refresh data after successful deletion
      await fetchLocations();
      return { success: true };
    } catch (err) {
      console.error('Failed to delete zone:', err);
      setError(prev => ({ ...prev, zones: err.message }));
      return { success: false, error: err.message };
    }
  }, [masters.zones, masters.regions, masters.locations, fetchLocations]);
 
  // API-based CRUD operations for types
  const addType = useCallback(async (data) => {
    try {
      const typeData = { type: data.name };
      const response = await typesAPI.create(typeData);
      console.log('Type created successfully:', response);
      // Refresh types after successful creation
      await fetchTypes();
      return { success: true };
    } catch (err) {
      console.error('Failed to create type:', err);
      setError(prev => ({ ...prev, types: err.message }));
      return { success: false, error: err.message };
    }
  }, [fetchTypes]);
 
  const updateType = useCallback(async (itemId, data) => {
    try {
      const typeData = { type: data.name };
      await typesAPI.update(itemId, typeData);
      // Refresh types after successful update
      await fetchTypes();
      return { success: true };
    } catch (err) {
      console.error('Failed to update type:', err);
      setError(prev => ({ ...prev, types: err.message }));
      return { success: false, error: err.message };
    }
  }, [fetchTypes]);
 
  const deleteType = useCallback(async (itemId) => {
    try {
      await typesAPI.delete(itemId);
      // Refresh types after successful deletion
      await fetchTypes();
      return { success: true };
    } catch (err) {
      console.error('Failed to delete type:', err);
      setError(prev => ({ ...prev, types: err.message }));
      return { success: false, error: err.message };
    }
  }, [fetchTypes]);
 
  // API-based CRUD operations for stages
  const addStage = useCallback(async (data) => {
    try {
      const stageData = { stage_name: data.name };
      const response = await stagesAPI.create(stageData);
      console.log('Stage created successfully:', response);
      // Refresh stages after successful creation
      await fetchStages();
      return { success: true };
    } catch (err) {
      console.error('Failed to create stage:', err);
      setError(prev => ({ ...prev, stages: err.message }));
      return { success: false, error: err.message };
    }
  }, [fetchStages]);
 
  const updateStage = useCallback(async (itemId, data) => {
    try {
      const stageData = { stage_name: data.name };
      await stagesAPI.update(itemId, stageData);
      // Refresh stages after successful update
      await fetchStages();
      return { success: true };
    } catch (err) {
      console.error('Failed to update stage:', err);
      setError(prev => ({ ...prev, stages: err.message }));
      return { success: false, error: err.message };
    }
  }, [fetchStages]);
 
  const deleteStage = useCallback(async (itemId) => {
    try {
      await stagesAPI.delete(itemId);
      // Refresh stages after successful deletion
      await fetchStages();
      return { success: true };
    } catch (err) {
      console.error('Failed to delete stage:', err);
      setError(prev => ({ ...prev, stages: err.message }));
      return { success: false, error: err.message };
    }
  }, [fetchStages]);
 
  const value = {
    masters,
    loading,
    error,
    fetchAllData,
    fetchLocations,
    fetchTypes,
    fetchStages,
    addLocation,
    updateLocation,
    deleteLocation,
    addRegion,
    updateRegion,
    deleteRegion,
    addZone,
    updateZone,
    deleteZone,
    addType,
    updateType,
    deleteType,
    addStage,
    updateStage,
    deleteStage,
  };
 
  return (
    <MasterContext.Provider value={value}>
      {children}
    </MasterContext.Provider>
  );
};
 
export default MasterContext;
 