import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Modal from '@/components/ui/modal';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { locationsAPI } from '@/services/api';

const Masters = () => {
  // Single source of truth for all masters data
  const [masters, setMasters] = useState({
    locations: [],
    regions: [],
    zones: [],
  });
  const [loading, setLoading] = useState({ locations: false, regions: false, zones: false });
  const [error, setError] = useState({ locations: null, regions: null, zones: null });

  const [activeTab, setActiveTab] = useState('location');
  const [form, setForm] = useState({ open: false, type: '', data: {}, editing: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', item: null });

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

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const formatName = useCallback((value) => 
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  , []);

  // API-based CRUD operations for locations
  const addLocation = useCallback(async (data) => {
    try {
      const locationData = { location: data.name };
      const response = await locationsAPI.create(locationData);
      console.log('Location created successfully:', response);
      // Refresh locations after successful creation
      await fetchLocations();
      closeForm();
    } catch (err) {
      console.error('Failed to create location:', err);
      setError(prev => ({ ...prev, locations: err.message }));
    }
  }, [fetchLocations]);

  const updateLocation = useCallback(async (itemId, data) => {
    try {
      const locationData = { location: data.name };
      await locationsAPI.update(itemId, locationData);
      // Refresh locations after successful update
      await fetchLocations();
      closeForm();
    } catch (err) {
      console.error('Failed to update location:', err);
      setError(prev => ({ ...prev, locations: err.message }));
    }
  }, [fetchLocations]);

  const deleteLocation = useCallback(async (itemId) => {
    try {
      await locationsAPI.delete(itemId);
      // Refresh locations after successful deletion
      await fetchLocations();
      setDeleteDialog({ open: false, type: '', item: null });
    } catch (err) {
      console.error('Failed to delete location:', err);
      setError(prev => ({ ...prev, locations: err.message }));
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
      closeForm();
    } catch (err) {
      console.error('Failed to create region:', err);
      setError(prev => ({ ...prev, regions: err.message }));
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
      closeForm();
    } catch (err) {
      console.error('Failed to update region:', err);
      setError(prev => ({ ...prev, regions: err.message }));
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
      setDeleteDialog({ open: false, type: '', item: null });
    } catch (err) {
      console.error('Failed to delete region:', err);
      setError(prev => ({ ...prev, regions: err.message }));
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
      closeForm();
    } catch (err) {
      console.error('Failed to create zone:', err);
      setError(prev => ({ ...prev, zones: err.message }));
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
      closeForm();
    } catch (err) {
      console.error('Failed to update zone:', err);
      setError(prev => ({ ...prev, zones: err.message }));
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
      setDeleteDialog({ open: false, type: '', item: null });
    } catch (err) {
      console.error('Failed to delete zone:', err);
      setError(prev => ({ ...prev, zones: err.message }));
    }
  }, [masters.zones, masters.regions, masters.locations, fetchLocations]);

  // Generic CRUD handlers
  const getList = useCallback((type) => {
    const keyMap = {
      'location': 'locations',
      'region': 'regions', 
      'zone': 'zones'
    };
    return masters[keyMap[type]] || [];
  }, [masters]);
  const setList = useCallback((type, newList) => {
    const keyMap = {
      'location': 'locations',
      'region': 'regions', 
      'zone': 'zones'
    };
    setMasters(prev => ({ ...prev, [keyMap[type]]: newList }));
  }, []);

  const addItem = useCallback((type, data) => {
    setList(type, [...getList(type), { id: crypto.randomUUID(), ...data }]);
    closeForm();
  }, [getList, setList]);

  const updateItem = useCallback((type, itemId, data) => {
    setList(type, getList(type).map(item => 
      item.id === itemId ? { ...item, ...data } : item
    ));
    closeForm();
  }, [getList, setList]);

  const deleteItem = useCallback((type, itemId) => {
    if (type === 'location') {
      // Use API-based deletion for locations
      deleteLocation(itemId);
    } else if (type === 'region') {
      // Use API-based deletion for regions
      deleteRegion(itemId);
    } else if (type === 'zone') {
      // Use API-based deletion for zones
      deleteZone(itemId);
    }
  }, [deleteLocation, deleteRegion, deleteZone]);

  const openForm = useCallback((type, editing = null) => {
    setForm({ open: true, type, editing, data: editing || getDefaultData(type) });
  }, [getList]);

  const getDefaultData = useCallback((type) => {
    const data = {};
    if (type === 'region') data.location = '';
    if (['region', 'zone'].includes(type)) data.location = '';
    if (type === 'zone') data.region = '';
    return data;
  }, []);

  const closeForm = useCallback(() => {
    setForm({ open: false, type: '', data: {}, editing: null });
  }, []);

  const openDelete = useCallback((type, item) => {
    setDeleteDialog({ open: true, type, item });
  }, []);

  const handleSubmit = useCallback(() => {
    const { type, data, editing } = form;
    const formattedData = { ...data };
    
    if ('name' in formattedData) formattedData.name = formatName(formattedData.name);
    if ('region' in formattedData) formattedData.region = formatName(formattedData.region);
    if ('zone' in formattedData) formattedData.zone = formatName(formattedData.zone);

    if (type === 'location') {
      // Use API-based operations for locations
      if (editing) {
        updateLocation(editing.id, formattedData);
      } else {
        addLocation(formattedData);
      }
    } else if (type === 'region') {
      // Use API-based operations for regions
      if (editing) {
        updateRegion(editing.id, formattedData);
      } else {
        addRegion(formattedData);
      }
    } else if (type === 'zone') {
      // Use API-based operations for zones
      if (editing) {
        updateZone(editing.id, formattedData);
      } else {
        addZone(formattedData);
      }
    }
  }, [form, addItem, updateItem, formatName, addLocation, updateLocation, addRegion, updateRegion, addZone, updateZone]);

  const sidebarTabs = [
    { id: 'location', label: 'Location', columns: ['S.No', 'Location', 'Status', 'Action'] },
    { id: 'region', label: 'Zone', columns: ['S.No', 'Location', 'Zone', 'Action'] },
    { id: 'zone', label: 'Area', columns: ['S.No', 'Location', 'Zone', 'Area', 'Action'] },
    { id: 'type', label: 'Type', columns: ['S.No', 'Location', 'Zone', 'Area', 'Action'] },
  ];

  const getOptions = useCallback((type, selectedLocation = null) => {
    if (type === 'location') return masters.locations.map(l => ({ value: l.name, label: l.name }));
    if (type === 'region') {
      if (selectedLocation) {
        // Filter regions by selected location
        return masters.regions
          .filter(r => r.location === selectedLocation)
          .map(r => ({ value: r.region, label: r.region }));
      }
      return masters.regions.map(r => ({ value: r.region, label: r.region }));
    }
    return [];
  }, [masters]);

  const renderFormFields = () => {
    const { type, data } = form;
    return (
      <>
        {type === 'region' && (
          <Select 
            value={data.location || ''}
            onChange={(value) => setForm(prev => ({ ...prev, data: { ...prev.data, location: value } }))}
            options={getOptions('location')}
            placeholder="Select location"
            disabled={!!form.editing}
          />
        )}
        {type === 'zone' && (
          <>
            <Select 
              value={data.location || ''}
              onChange={(value) => setForm(prev => ({ 
                ...prev, 
                data: { ...prev.data, location: value, region: '' } // Clear region when location changes
              }))}
              options={getOptions('location')}
              placeholder="Select location"
              disabled={!!form.editing}
            />
            <Select 
              value={data.region || ''}
              onChange={(value) => setForm(prev => ({ ...prev, data: { ...prev.data, region: value } }))}
              options={getOptions('region', data.location)}
              placeholder="Select zone"
              disabled={!!form.editing}
            />
          </>
        )}
        <Input
          value={type === 'region' ? (data.region || '') : type === 'zone' ? (data.zone || '') : (data.name || '')}
          onChange={(e) => {
            const value = e.target.value;
            const key = type === 'region' ? 'region' : type === 'zone' ? 'zone' : 'name';
            setForm(prev => ({ ...prev, data: { ...prev.data, [key]: value } }));
          }}
          placeholder={`Enter ${type === 'region' ? 'zone' : type === 'zone' ? 'area' : type} name`}
        />
      </>
    );
  };

  const renderTable = (type) => {
    const items = getList(type);
    const tabConfig = sidebarTabs.find(t => t.id === type);
    
    // Show loading state
    if (loading[type]) {
      return (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center text-gray-500">Loading {type}s...</div>
        </div>
      );
    }

    // Show error state
    if (error[type]) {
      return (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center text-red-500">Error: {error[type]}</div>
          <div className="text-center mt-4">
            <Button onClick={fetchLocations} variant="outline">Retry</Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              {tabConfig.columns.map((col, idx) => (
                <TableHead key={idx} className={col === 'Action' ? 'w-24' : col === 'S.No' ? 'w-16' : 'text-center'}>
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                {type === 'location' && (
                  <>
                    <TableCell className="text-center">{item.name}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status || 'active'}
                      </span>
                    </TableCell>
                  </>
                )}
                {type !== 'location' && <TableCell className="text-center">{item.location}</TableCell>}
                {type === 'region' && <TableCell className="text-center">{item.region}</TableCell>}
                {type === 'zone' && (
                  <>
                    <TableCell className="text-center">{item.region}</TableCell>
                    <TableCell className="text-center">{item.zone}</TableCell>
                  </>
                )}
                <TableCell>
                  <ActionButtons
                    onEdit={() => openForm(type, item)}
                    onDelete={() => openDelete(type, item)}
                    showDelete={type !== 'location'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Masters</h1>
      
      <div className="flex gap-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow p-2 h-fit">
          <div className="flex flex-col gap-2">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-md font-medium text-left transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {sidebarTabs.map((tab) => activeTab === tab.id && (
            <div key={tab.id}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-indigo-700">{tab.label} Management</h2>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => openForm(tab.id)}
                >
                  <Plus className="h-4 w-4" />
                  Add {tab.label}
                </Button>
              </div>
              {renderTable(tab.id)}
            </div>
          ))}
        </div>
      </div>

      {/* Generic Add/Edit Modal */}
      <Modal open={form.open} onClose={closeForm}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-indigo-700">
            {form.editing ? `Edit ${form.type === 'region' ? 'Zone' : form.type === 'zone' ? 'Area' : form.type}` : `Add New ${form.type === 'region' ? 'Zone' : form.type === 'zone' ? 'Area' : form.type}`}
          </h2>
          {renderFormFields()}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {form.editing ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Generic Delete Modal */}
      <Modal open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', item: null })}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">Delete {activeTab === 'region' ? 'Zone' : activeTab === 'zone' ? 'Area' : activeTab}</h2>
          <p className="text-gray-700">
            Are you sure you want to delete <strong>"{deleteDialog.item?.name || deleteDialog.item?.region || deleteDialog.item?.zone || ''}"</strong>?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, type: '', item: null })}>Cancel</Button>
            <Button 
              variant="destructive" 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={() => deleteItem(deleteDialog.type, deleteDialog.item?.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Reusable Components
const ActionButtons = ({ onEdit, onDelete,showDelete }) => (
  <div className="flex gap-1">
    <Button variant="ghost" size="sm" className="p-2" onClick={onEdit}>
      <Edit className="h-4 w-4" />
    </Button>
    {showDelete && (
    <Button
      variant="ghost"
      size="sm"
      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      onClick={onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
    )}
  </div>
);

export default Masters;
