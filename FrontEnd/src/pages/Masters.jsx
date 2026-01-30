import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useMaster } from '@/context/Mastercontext';

const Masters = () => {
  const {
    masters,
    loading,
    error,
    fetchAllData,
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
  } = useMaster();

  const [activeTab, setActiveTab] = useState('location');
  const [form, setForm] = useState({ open: false, type: '', data: {}, editing: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', item: null });
  const [currentPage, setCurrentPage] = useState({
    location: 1,
    region: 1,
    zone: 1,
    type: 1,
    stage: 1,
  });
  const itemsPerPage = 10;

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const formatName = useCallback((value) => 
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  , []);

  // Generic CRUD handlers
  const getList = useCallback((type) => {
    const keyMap = {
      'location': 'locations',
      'region': 'regions', 
      'zone': 'zones',
      'type': 'types',
      'stage':'stages'
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

  const deleteItem = useCallback(async (type, itemId) => {
    let result;
    if (type === 'location') {
      result = await deleteLocation(itemId);
    } else if (type === 'region') {
      result = await deleteRegion(itemId);
    } else if (type === 'zone') {
      result = await deleteZone(itemId);
    } else if (type === 'type') {
      result = await deleteType(itemId);
    } else if (type === 'stage') {
      result = await deleteStage(itemId);
    }
    
    if (result?.success) {
      setDeleteDialog({ open: false, type: '', item: null });
    }
  }, [deleteLocation, deleteRegion, deleteZone, deleteType, deleteStage]);

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

  const handleSubmit = useCallback(async () => {
    const { type, data, editing } = form;
    const formattedData = { ...data };
    
    if ('name' in formattedData) formattedData.name = formatName(formattedData.name);
    if ('region' in formattedData) formattedData.region = formatName(formattedData.region);
    if ('zone' in formattedData) formattedData.zone = formatName(formattedData.zone);

    let result;
    if (type === 'location') {
      if (editing) {
        result = await updateLocation(editing.id, formattedData);
      } else {
        result = await addLocation(formattedData);
      }
    } else if (type === 'region') {
      if (editing) {
        result = await updateRegion(editing.id, formattedData);
      } else {
        result = await addRegion(formattedData);
      }
    } else if (type === 'zone') {
      if (editing) {
        result = await updateZone(editing.id, formattedData);
      } else {
        result = await addZone(formattedData);
      }
    } else if (type === 'type') {
      if (editing) {
        result = await updateType(editing.id, formattedData);
      } else {
        result = await addType(formattedData);
      }
    } else if (type === 'stage') {
      if (editing) {
        result = await updateStage(editing.id, formattedData);
      } else {
        result = await addStage(formattedData);
      }
    }

    if (result?.success) {
      closeForm();
    }
  }, [form, formatName, addLocation, updateLocation, addRegion, updateRegion, addZone, updateZone, addType, updateType, addStage, updateStage]);

  const sidebarTabs = [
    { id: 'location', label: 'Location', columns: ['S.No', 'Location', 'Status', 'Action'] },
    { id: 'region', label: 'Zone', columns: ['S.No', 'Location', 'Zone', 'Action'] },
    { id: 'zone', label: 'Area', columns: ['S.No', 'Location', 'Zone', 'Area', 'Action'] },
    { id: 'type', label: 'Type', columns: ['S.No', 'Type', 'Status', 'Action'] },
    { id: 'stage', label: 'Stage', columns: ['S.No', 'Stage', 'Status','Action'] },
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
            onValueChange={(value) => setForm(prev => ({ ...prev, data: { ...prev.data, location: value } }))}
            disabled={!!form.editing}
          >
            <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-lg">
              {getOptions('location').map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {type === 'zone' && (
          <>
            <Select 
              value={data.location || ''}
              onValueChange={(value) => setForm(prev => ({ 
                ...prev, 
                data: { ...prev.data, location: value, region: '' } // Clear region when location changes
              }))}
              disabled={!!form.editing}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                {getOptions('location').map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={data.region || ''}
              onValueChange={(value) => setForm(prev => ({ ...prev, data: { ...prev.data, region: value } }))}
              disabled={!!form.editing}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                {getOptions('region', data.location).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
        <Input
          value={
            type === 'region' ? (data.region || '') : 
            type === 'zone' ? (data.zone || '') : 
            type === 'stage' ? (data.name || '') :
            (data.name || '')
          }
          onChange={(e) => {
            const value = e.target.value;
            const key = type === 'region' ? 'region' : type === 'zone' ? 'zone' : 'name';
            setForm(prev => ({ ...prev, data: { ...prev.data, [key]: value } }));
          }}
          placeholder={`Enter ${type === 'region' ? 'zone' : type === 'zone' ? 'area' : type === 'stage' ? 'stage' : type} name`}
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
            <Button onClick={fetchAllData} variant="outline">Retry</Button>
          </div>
        </div>
      );
    }

    // Calculate pagination
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage[type] - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);
    
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
            {paginatedItems.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
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
                {type === 'type' && (
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
                {type === 'stage' && (
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
                {type !== 'location' && type !== 'type' && type !== 'stage' && <TableCell className="text-center">{item.location}</TableCell>}
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
                    showDelete={true}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, items.length)} of {items.length} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage[type] === 1}
                onClick={() => setCurrentPage(prev => ({ ...prev, [type]: prev[type] - 1 }))}
                className="text-gray-700"
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm text-gray-600 flex items-center">
                Page {currentPage[type]} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage[type] === totalPages}
                onClick={() => setCurrentPage(prev => ({ ...prev, [type]: prev[type] + 1 }))}
                className="text-gray-700"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-indigo-600 mb-3">Masters</h1>
      
      <div className="flex gap-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow p-1 h-fit">
          <div className="flex flex-col gap-2">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md font-medium text-left transition-colors whitespace-nowrap ${
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
                <h2 className="text-l font-bold text-indigo-700">{tab.label} Management</h2>
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
        <div className="space-y-4" onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}>
          <h2 className="text-xl font-bold text-indigo-700">
            {form.editing ? `Edit ${form.type === 'region' ? 'Zone' : form.type === 'zone' ? 'Area' : form.type === 'stage' ? 'Stage' : form.type}` : `Add New ${form.type === 'region' ? 'Zone' : form.type === 'zone' ? 'Area' : form.type === 'stage' ? 'Stage' : form.type}`}
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
        <div className="space-y-4" onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            deleteItem(deleteDialog.type, deleteDialog.item?.id);
          }
        }}>
          <h2 className="text-xl font-bold text-red-600">Delete {activeTab === 'region' ? 'Zone' : activeTab === 'zone' ? 'Area' : activeTab === 'stage' ? 'Stage' : activeTab}</h2>
          <p className="text-gray-700">
            Are you sure you want to delete <strong>"{deleteDialog.item?.name || deleteDialog.item?.region || deleteDialog.item?.zone || ''}"</strong>?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, type: '', item: null })}>Cancel</Button>
            <Button 
              variant="destructive" 
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