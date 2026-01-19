const API_BASE_URL = 'http://localhost:5000/api';
 
// Generic API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
 
  // Get token from localStorage
  const token = localStorage.getItem('token');
 
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
 
  try {
    const response = await fetch(url, config);
   
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
   
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
 
// Mediators API
export const mediatorsAPI = {
  // Get all mediators
  getAll: async () => {
    const response = await apiRequest('/mediators/all');
    // The API returns { count: number, data: [...] }
    // We want to return the data array
    return response.data || [];
  },
 
  // Get mediator by ID
  getById: async (id) => {
    return await apiRequest(`/mediators/${id}`);
  },
 
  // Create new mediator with file uploads
  create: async (mediatorData, files = {}) => {
    const formData = new FormData();
   
    // Add all text fields
    Object.keys(mediatorData).forEach(key => {
      if (mediatorData[key] !== null && mediatorData[key] !== undefined) {
        formData.append(key, mediatorData[key]);
      }
    });
   
    // Add file uploads if present
    if (files.pan_upload) {
      formData.append('pan_upload', files.pan_upload);
    }
    if (files.aadhar_upload) {
      formData.append('aadhar_upload', files.aadhar_upload);
    }
   
    return await apiRequest('/mediators/create', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it with boundary
    });
  },
 
  // Update mediator
  update: async (id, mediatorData) => {
    return await apiRequest(`/mediators/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mediatorData),
    });
  },
 
  // Delete mediator
  delete: async (id) => {
    return await apiRequest(`/mediators/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
 
// Leads API
export const leadsAPI = {
  // Get all leads
  getAll: async () => {
    const response = await apiRequest('/leads/all');
    // The API returns { count: number, data: [...] }
    // We want to return the data array
    return response.data || [];
  },
 
  // Get lead by ID
  getById: async (id) => {
    return await apiRequest(`/leads/${id}`);
  },
 
  // Create new lead
  create: async (leadData) => {
    return await apiRequest('/leads/create', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },
 
  // Update lead
  update: async (id, leadData) => {
    return await apiRequest(`/leads/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  },
 
  // Delete lead
  delete: async (id) => {
    return await apiRequest(`/leads/${id}`, {
      method: 'DELETE',
    });
  },
};
 
// Users API
export const usersAPI = {
  // Get all users (requires authentication)
  getAll: async () => {
    const response = await apiRequest('/users/all');
    // The API returns { message: string, count: number, users: [...] }
    // We want to return the users array
    return response.users || [];
  },
 
  // Get user by ID
  getById: async (id) => {
    const response = await apiRequest(`/users/${id}`);
    // The API returns { message: string, data: {...} }
    // We want to return the data object
    return response.data || response;
  },
 
  // Create new user (no auth required)
  create: async (userData) => {
    return await apiRequest('/users/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
 
  // Update user (requires authentication)
  update: async (id, userData) => {
    const response = await apiRequest(`/users/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    // The API returns { message: string, user: {...} }
    // We want to return the user object
    return response.user || response;
  },
 
  // Delete user (requires authentication)
  delete: async (id) => {
    return await apiRequest(`/users/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
 
// Locations API
export const locationsAPI = {
  // Get all locations
  getAll: async () => {
    const response = await apiRequest('/locations/all');
    // The API returns { message: string, locations: [...] }
    // We want to return the locations array
    return response.locations || [];
  },
 
  // Get location by ID
  getById: async (id) => {
    return await apiRequest(`/locations/${id}`);
  },
 
  // Create new location
  create: async (locationData) => {
    return await apiRequest('/locations/create', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  },
 
  // Update location
  update: async (id, locationData) => {
    return await apiRequest(`/locations/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
  },
 
  // Delete location
  delete: async (id) => {
    return await apiRequest(`/locations/${id}`, {
      method: 'DELETE',
    });
  },
 
  // Region operations
  addRegion: async (locationId, regionData) => {
    return await apiRequest(`/locations/${locationId}/regions`, {
      method: 'POST',
      body: JSON.stringify(regionData),
    });
  },
 
  updateRegion: async (locationId, regionId, regionData) => {
    return await apiRequest(`/locations/update/${locationId}/regions/${regionId}`, {
      method: 'PUT',
      body: JSON.stringify(regionData),
    });
  },
 
  deleteRegion: async (locationId, regionId) => {
    return await apiRequest(`/locations/${locationId}/regions/${regionId}`, {
      method: 'DELETE',
    });
  },
 
  // Zone operations
  addZone: async (locationId, regionId, zoneData) => {
    return await apiRequest(`/locations/${locationId}/regions/${regionId}/zones`, {
      method: 'POST',
      body: JSON.stringify(zoneData),
    });
  },
 
  updateZone: async (locationId, regionId, zoneId, zoneData) => {
    return await apiRequest(`/locations/update/${locationId}/regions/${regionId}/zones/${zoneId}`, {
      method: 'PUT',
      body: JSON.stringify(zoneData),
    });
  },
 
  deleteZone: async (locationId, regionId, zoneId) => {
    return await apiRequest(`/locations/${locationId}/regions/${regionId}/zones/${zoneId}`, {
      method: 'DELETE',
    });
  },
};
 
// Export other API modules as needed
export const authAPI = {
  login: async (credentials) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
 
  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};
 
export default {
  mediatorsAPI,
  leadsAPI,
  usersAPI,
  locationsAPI,
  authAPI,
};