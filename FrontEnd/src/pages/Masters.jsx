import React, { useState, useCallback } from 'react';
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

const Masters = () => {
  // Single source of truth for all masters data
  const [masters, setMasters] = useState({
    locations: [
      { id: crypto.randomUUID(), name: 'Mumbai' },
      { id: crypto.randomUUID(), name: 'Delhi' },
      { id: crypto.randomUUID(), name: 'Bangalore' },
    ],
    regions: [
      { id: crypto.randomUUID(), location: 'Mumbai', region: 'North Mumbai' },
      { id: crypto.randomUUID(), location: 'Delhi', region: 'Central Delhi' },
    ],
    zones: [
      { id: crypto.randomUUID(), location: 'Mumbai', region: 'North Mumbai', zone: 'Andheri' },
      { id: crypto.randomUUID(), location: 'Delhi', region: 'Central Delhi', zone: 'Connaught Place' },
    ],
  });

  const [activeTab, setActiveTab] = useState('location');
  const [form, setForm] = useState({ open: false, type: '', data: {}, editing: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', item: null });

  const formatName = useCallback((value) => 
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  , []);

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
    // Dependency cleanup
    if (type === 'locations') {
      setList('regions', masters.regions.filter(r => r.location !== masters.locations.find(l => l.id === itemId)?.name));
      setList('zones', masters.zones.filter(z => z.location !== masters.locations.find(l => l.id === itemId)?.name));
    } else if (type === 'regions') {
      setList('zones', masters.zones.filter(z => z.region !== masters.regions.find(r => r.id === itemId)?.region));
    }
    
    setList(type, getList(type).filter(item => item.id !== itemId));
    setDeleteDialog({ open: false, type: '', item: null });
  }, [masters, getList, setList]);

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

    if (editing) {
      updateItem(type, editing.id, formattedData);
    } else {
      addItem(type, formattedData);
    }
  }, [form, addItem, updateItem, formatName]);

  const sidebarTabs = [
    { id: 'location', label: 'Location', columns: ['S.No', 'Location', 'Action'] },
    { id: 'region', label: 'Region', columns: ['S.No', 'Location', 'Region', 'Action'] },
    { id: 'zone', label: 'Zone', columns: ['S.No', 'Location', 'Region', 'Zone', 'Action'] },
  ];

  const getOptions = useCallback((type) => {
    if (type === 'location') return masters.locations.map(l => ({ value: l.name, label: l.name }));
    if (type === 'region') return masters.regions.map(r => ({ value: r.region, label: r.region }));
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
          />
        )}
        {type === 'zone' && (
          <>
            <Select 
              value={data.location || ''}
              onChange={(value) => setForm(prev => ({ ...prev, data: { ...prev.data, location: value } }))}
              options={getOptions('location')}
              placeholder="Select location"
            />
            <Select 
              value={data.region || ''}
              onChange={(value) => setForm(prev => ({ ...prev, data: { ...prev.data, region: value } }))}
              options={getOptions('region')}
              placeholder="Select region"
            />
          </>
        )}
        <Input
          value={data.name || data.region || data.zone || ''}
          onChange={(value) => {
            const key = type === 'region' ? 'region' : type === 'zone' ? 'zone' : 'name';
            setForm(prev => ({ ...prev, data: { ...prev.data, [key]: value } }));
          }}
          placeholder={`Enter ${type} name`}
        />
      </>
    );
  };

  const renderTable = (type) => {
    const items = getList(type);
    const tabConfig = sidebarTabs.find(t => t.id === type);
    
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
                {type === 'location' && <TableCell className="text-center">{item.name}</TableCell>}
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
            {form.editing ? `Edit ${form.type}` : `Add New ${form.type}`}
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
          <h2 className="text-xl font-bold text-red-600">Delete {activeTab}</h2>
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
const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex gap-1">
    <Button variant="ghost" size="sm" className="p-2" onClick={onEdit}>
      <Edit className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      onClick={onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

export default Masters;
