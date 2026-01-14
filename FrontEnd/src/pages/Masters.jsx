import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit, Plus, Trash2 } from 'lucide-react';

const Masters = () => {
  const [activeTab, setActiveTab] = useState('location');
  const [locations, setLocations] = useState([
    { id: 1, name: 'Mumbai' },
    { id: 2, name: 'Delhi' },
    { id: 3, name: 'Bangalore' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [editingLocation, setEditingLocation] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [regions, setRegions] = useState([
    { id: 1, location: 'Mumbai', region: 'North Mumbai' },
    { id: 2, location: 'Delhi', region: 'Central Delhi' },
  ]);
  const [isRegionDialogOpen, setIsRegionDialogOpen] = useState(false);
  const [newRegion, setNewRegion] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [editingRegion, setEditingRegion] = useState(null);
  const [isDeleteRegionDialogOpen, setIsDeleteRegionDialogOpen] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState(null);
  const [zones, setZones] = useState([
    { id: 1, location: 'Mumbai', region: 'North Mumbai', zone: 'Andheri' },
    { id: 2, location: 'Delhi', region: 'Central Delhi', zone: 'Connaught Place' },
  ]);
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [newZone, setNewZone] = useState('');
  const [selectedZoneLocation, setSelectedZoneLocation] = useState('');
  const [selectedZoneRegion, setSelectedZoneRegion] = useState('');
  const [editingZone, setEditingZone] = useState(null);
  const [isDeleteZoneDialogOpen, setIsDeleteZoneDialogOpen] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null);

  const sidebarTabs = [
    { id: 'location', label: 'Location' },
    { id: 'region', label: 'Region' },
    { id: 'zone', label: 'Zone' },
  ];

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      const formattedLocation = newLocation.charAt(0).toUpperCase() + newLocation.slice(1).toLowerCase();
      setLocations([...locations, { id: Date.now(), name: formattedLocation }]);
      setNewLocation('');
      setIsDialogOpen(false);
    }
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setNewLocation(location.name);
    setIsDialogOpen(true);
  };

  const handleUpdateLocation = () => {
    if (newLocation.trim() && editingLocation) {
      const formattedLocation = newLocation.charAt(0).toUpperCase() + newLocation.slice(1).toLowerCase();
      setLocations(locations.map(loc => 
        loc.id === editingLocation.id ? { ...loc, name: formattedLocation } : loc
      ));
      setNewLocation('');
      setEditingLocation(null);
      setIsDialogOpen(false);
    }
  };

  const handleCloseDialog = () => {
    setNewLocation('');
    setEditingLocation(null);
    setIsDialogOpen(false);
  };

  const handleDeleteClick = (location) => {
    setLocationToDelete(location);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (locationToDelete) {
      setLocations(locations.filter(loc => loc.id !== locationToDelete.id));
      setLocationToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setLocationToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleAddRegion = () => {
    if (newRegion.trim() && selectedLocation) {
      const formattedRegion = newRegion.charAt(0).toUpperCase() + newRegion.slice(1).toLowerCase();
      setRegions([...regions, { id: Date.now(), location: selectedLocation, region: formattedRegion }]);
      setNewRegion('');
      setSelectedLocation('');
      setIsRegionDialogOpen(false);
    }
  };

  const handleEditRegion = (region) => {
    setEditingRegion(region);
    setSelectedLocation(region.location);
    setNewRegion(region.region);
    setIsRegionDialogOpen(true);
  };

  const handleUpdateRegion = () => {
    if (newRegion.trim() && selectedLocation && editingRegion) {
      const formattedRegion = newRegion.charAt(0).toUpperCase() + newRegion.slice(1).toLowerCase();
      setRegions(regions.map(reg => 
        reg.id === editingRegion.id ? { ...reg, location: selectedLocation, region: formattedRegion } : reg
      ));
      setNewRegion('');
      setSelectedLocation('');
      setEditingRegion(null);
      setIsRegionDialogOpen(false);
    }
  };

  const handleCloseRegionDialog = () => {
    setNewRegion('');
    setSelectedLocation('');
    setEditingRegion(null);
    setIsRegionDialogOpen(false);
  };

  const handleDeleteRegionClick = (region) => {
    setRegionToDelete(region);
    setIsDeleteRegionDialogOpen(true);
  };

  const handleDeleteRegionConfirm = () => {
    if (regionToDelete) {
      setRegions(regions.filter(reg => reg.id !== regionToDelete.id));
      setRegionToDelete(null);
      setIsDeleteRegionDialogOpen(false);
    }
  };

  const handleDeleteRegionCancel = () => {
    setRegionToDelete(null);
    setIsDeleteRegionDialogOpen(false);
  };

  const handleAddZone = () => {
    if (newZone.trim() && selectedZoneLocation && selectedZoneRegion) {
      const formattedZone = newZone.charAt(0).toUpperCase() + newZone.slice(1).toLowerCase();
      setZones([...zones, { id: Date.now(), location: selectedZoneLocation, region: selectedZoneRegion, zone: formattedZone }]);
      setNewZone('');
      setSelectedZoneLocation('');
      setSelectedZoneRegion('');
      setIsZoneDialogOpen(false);
    }
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setSelectedZoneLocation(zone.location);
    setSelectedZoneRegion(zone.region);
    setNewZone(zone.zone);
    setIsZoneDialogOpen(true);
  };

  const handleUpdateZone = () => {
    if (newZone.trim() && selectedZoneLocation && selectedZoneRegion && editingZone) {
      const formattedZone = newZone.charAt(0).toUpperCase() + newZone.slice(1).toLowerCase();
      setZones(zones.map(z => 
        z.id === editingZone.id ? { ...z, location: selectedZoneLocation, region: selectedZoneRegion, zone: formattedZone } : z
      ));
      setNewZone('');
      setSelectedZoneLocation('');
      setSelectedZoneRegion('');
      setEditingZone(null);
      setIsZoneDialogOpen(false);
    }
  };

  const handleCloseZoneDialog = () => {
    setNewZone('');
    setSelectedZoneLocation('');
    setSelectedZoneRegion('');
    setEditingZone(null);
    setIsZoneDialogOpen(false);
  };

  const handleDeleteZoneClick = (zone) => {
    setZoneToDelete(zone);
    setIsDeleteZoneDialogOpen(true);
  };

  const handleDeleteZoneConfirm = () => {
    if (zoneToDelete) {
      setZones(zones.filter(z => z.id !== zoneToDelete.id));
      setZoneToDelete(null);
      setIsDeleteZoneDialogOpen(false);
    }
  };

  const handleDeleteZoneCancel = () => {
    setZoneToDelete(null);
    setIsDeleteZoneDialogOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Masters</h2>
          <nav className="space-y-2">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'location' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Location Management</h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Location
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingLocation ? 'Edit Location' : 'Add New Location'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      label="Location Name"
                      value={newLocation}
                      onChange={setNewLocation}
                      placeholder="Enter location name"
                      required
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCloseDialog}>
                        Cancel
                      </Button>
                      <Button onClick={editingLocation ? handleUpdateLocation : handleAddLocation}>
                        {editingLocation ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">S.No</TableHead>
                    <TableHead className="text-center">Location</TableHead>
                    <TableHead className="w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location, index) => (
                    <TableRow key={location.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-center">{location.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLocation(location)}
                            className="p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(location)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === 'region' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Region Management</h1>
              <Dialog open={isRegionDialogOpen} onOpenChange={setIsRegionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Region
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingRegion ? 'Edit Region' : 'Add New Region'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Select
                      label="Location"
                      value={selectedLocation}
                      onChange={setSelectedLocation}
                      options={locations.map(loc => ({ value: loc.name, label: loc.name }))}
                      placeholder="Select location"
                      required
                    />
                    <Input
                      label="Region Name"
                      value={newRegion}
                      onChange={setNewRegion}
                      placeholder="Enter region name"
                      required
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCloseRegionDialog}>
                        Cancel
                      </Button>
                      <Button onClick={editingRegion ? handleUpdateRegion : handleAddRegion}>
                        {editingRegion ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">S.No</TableHead>
                    <TableHead className="text-center">Location</TableHead>
                    <TableHead className="text-center">Region</TableHead>
                    <TableHead className="w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regions.map((region, index) => (
                    <TableRow key={region.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-center">{region.location}</TableCell>
                      <TableCell className="text-center">{region.region}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRegion(region)}
                            className="p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRegionClick(region)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete the location "<strong>{locationToDelete?.name}</strong>"?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleDeleteCancel}>
                  Cancel
                </Button>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteConfirm}>
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Region Delete Confirmation Dialog */}
        <Dialog open={isDeleteRegionDialogOpen} onOpenChange={setIsDeleteRegionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Region</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete the region "<strong>{regionToDelete?.region}</strong>"?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleDeleteRegionCancel}>
                  Cancel
                </Button>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteRegionConfirm}>
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {activeTab === 'zone' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Zone Management</h1>
              <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Zone
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingZone ? 'Edit Zone' : 'Add New Zone'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Select
                      label="Location"
                      value={selectedZoneLocation}
                      onChange={setSelectedZoneLocation}
                      options={locations.map(loc => ({ value: loc.name, label: loc.name }))}
                      placeholder="Select location"
                      required
                    />
                    <Select
                      label="Region"
                      value={selectedZoneRegion}
                      onChange={setSelectedZoneRegion}
                      options={regions.map(reg => ({ value: reg.region, label: reg.region }))}
                      placeholder="Select region"
                      required
                    />
                    <Input
                      label="Zone Name"
                      value={newZone}
                      onChange={setNewZone}
                      placeholder="Enter zone name"
                      required
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCloseZoneDialog}>
                        Cancel
                      </Button>
                      <Button onClick={editingZone ? handleUpdateZone : handleAddZone}>
                        {editingZone ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">S.No</TableHead>
                    <TableHead className="text-center">Location</TableHead>
                    <TableHead className="text-center">Region</TableHead>
                    <TableHead className="text-center">Zone</TableHead>
                    <TableHead className="w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone, index) => (
                    <TableRow key={zone.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-center">{zone.location}</TableCell>
                      <TableCell className="text-center">{zone.region}</TableCell>
                      <TableCell className="text-center">{zone.zone}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditZone(zone)}
                            className="p-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteZoneClick(zone)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Masters;