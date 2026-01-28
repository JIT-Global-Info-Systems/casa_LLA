const API_BASE_URL = 'http://13.201.132.94:5000/api';
// const API_BASE_URL = 'http://localhost:5000/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

// Helper to extract user-friendly error messages
const getErrorMessage = (error, statusCode) => {
  // Handle network errors
  if (!statusCode) {
    return 'Could not connect. Please check your internet connection.';
  }

  // Handle specific status codes
  switch (statusCode) {
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested information could not be found.';
    case 500:
    case 502:
    case 503:
      return 'Could not complete your request. Please try again.';
    default:
      return error.message || 'Something went wrong. Please try again.';
  }
};

// Helper to handle timeout
const fetchWithTimeout = (url, options, timeout = REQUEST_TIMEOUT) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
};

// Generic API request helper with retry logic
const apiRequest = async (endpoint, options = {}, retryCount = 0) => {
  const url = `${API_BASE_URL}${endpoint}`;
 
  // Get token from localStorage
  const token = localStorage.getItem('token');
 
  // Skip authentication for auth endpoints
  const isAuthEndpoint = endpoint.startsWith('/auth/');
 
  if (!token && !isAuthEndpoint) {
    throw new Error('Your session has expired. Please log in again.');
  }
 
  const headers = {
    ...(token && !isAuthEndpoint && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
 
  // Only set Content-Type to application/json if not already set AND body is not FormData
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
 
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetchWithTimeout(url, config);
 
    // Handle 401 - clear auth and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Your session has expired. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = getErrorMessage(
        { message: errorData.message },
        response.status
      );
      const error = new Error(errorMessage);
      error.statusCode = response.status;
      throw error;
    }
 
    return await response.json();
  } catch (error) {
    // Retry logic for network errors or 5xx errors
    const shouldRetry = (
      retryCount < MAX_RETRIES &&
      (!error.statusCode || error.statusCode >= 500)
    );

    if (shouldRetry) {
      // Exponential backoff: wait 1s, then 2s
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return apiRequest(endpoint, options, retryCount + 1);
    }

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
        let value = mediatorData[key];
        // Ensure address is a JSON string for backend parsing if it's the address field
        // This matches the logic used in the update method
        if (key === 'address') {
          value = JSON.stringify(value);
        }
        formData.append(key, value);
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
    });
  },
 
  // Update mediator
  update: async (id, mediatorData) => {
    // Ensure address is a JSON string for backend parsing
    // Backend expects req.body.address to be a JSON string it can parse
    const dataToSend = { ...mediatorData };
    if (dataToSend.address !== undefined && dataToSend.address !== null) {
      if (typeof dataToSend.address === 'object') {
        // If it's already an object, stringify it
        dataToSend.address = JSON.stringify(dataToSend.address);
      } else if (typeof dataToSend.address === 'string') {
        // If it's a plain string, we need to JSON.stringify it so it becomes a JSON string
        // When Express parses the body, it will be a string, which backend can then parse
        // But backend expects a JSON string, so we stringify the string value
        dataToSend.address = JSON.stringify(dataToSend.address);
      }
    }
    return await apiRequest(`/mediators/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dataToSend),
    });
  },
 
  // Delete mediator
  delete: async (id) => {
    const response = await apiRequest(`/mediators/delete/${id}`, {
      method: 'DELETE',
    });
    // Return the deleted mediator data from response
    return response.data || response;
  },
};
 
// Leads API
export const leadsAPI = {
  // Get all leads
  getAll: async () => {
    const response = await apiRequest('/leads/pending');
    // The API returns { count: number, data: [...] }
    // We want to return the data array
    return response.data || [];
  },
 
  // Get lead by ID
  getById: async (id) => {
    const response = await apiRequest(`/leads/${id}`);
    // The API returns { success: true, data: {...} }
    // We want to return the data object
    return response.data || response;
  },
 
  // Create new lead
  create: async (leadData, files = {}) => {
    const hasFiles = Boolean(files?.fmb_sketch || files?.patta_chitta);
 
    // Backend supports JSON body OR multipart with a `data` JSON string
    if (!hasFiles) {
      return await apiRequest('/leads/create', {
        method: 'POST',
        body: JSON.stringify(leadData),
      });
    }
 
    const formData = new FormData();
    formData.append('data', JSON.stringify(leadData));
 
    if (files.fmb_sketch) formData.append('fmb_sketch', files.fmb_sketch);
    if (files.patta_chitta) formData.append('patta_chitta', files.patta_chitta);
 
    return await apiRequest('/leads/create', {
      method: 'POST',
      body: formData,
    });
  },
 
  // Update lead
  update: async (id, leadData, files = {}) => {
    // If files are provided, use FormData
    if (files.fmb_sketch || files.patta_chitta) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(leadData));
 
      // Add file uploads if present
      if (files.fmb_sketch) {
        formData.append('fmb_sketch', files.fmb_sketch);
      }
      if (files.patta_chitta) {
        formData.append('patta_chitta', files.patta_chitta);
      }
 
      return await apiRequest(`/leads/update/${id}`, {
        method: 'PUT',
        body: formData,
      });
    } else {
      // Regular JSON update
      return await apiRequest(`/leads/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(leadData),
      });
    }
  },
 
  // Delete lead
  delete: async (id) => {
    const response = await apiRequest(`/leads/delete/${id}`, {
      method: 'DELETE',
    });
    // Return the deleted lead data from response
    return response.data || response;
  },
 
  // Get approved leads
  getApproved: async () => {
    const response = await apiRequest('/leads/approved');
    // The API returns { count: number, data: [...] }
    // We want to return the data array
    return response.data || [];
  },
 
  // Get purchased leads
  getPurchased: async () => {
    const response = await apiRequest('/leads/purchased');
    // The API returns { count: number, data: [...] }
    // We want to return the data array
    return response.data || [];
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
 
  // Create new user (requires authentication)
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
    return await apiRequest(`/locations/${locationId}/regions/delete/${regionId}`, {
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
      method: "DELETE",
    })
  },
}

// Types API
export const typesAPI = {
  // Get all types
  getAll: async () => {
    const response = await apiRequest('/types/');
    // The API returns { message: string, count: number, data: [...] }
    // We want to return the data array
    return response.data || [];
  },

  // Get type by ID
  getById: async (id) => {
    return await apiRequest(`/types/${id}`);
  },

  // Create new type
  create: async (typeData) => {
    return await apiRequest('/types', {
      method: 'POST',
      body: JSON.stringify(typeData),
    });
  },

  // Update type
  update: async (id, typeData) => {
    return await apiRequest(`/types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(typeData),
    });
  },

  // Delete type
  delete: async (id) => {
    return await apiRequest(`/types/${id}`, {
      method: 'DELETE',
    });
  },
}
 
// Calls API
export const callsAPI = {
  // Get all calls
  getAll: async () => {
    const response = await apiRequest("/leads/calls/all")
    return response.data || []
  },
 
  // Get call by ID
  getById: async (id) => {
    const response = await apiRequest(`/calls/${id}`)
    return response.data || response
  },
 
  // Create new call
  create: async (callData) => {
    return await apiRequest("/calls/create", {
      method: "POST",
      body: JSON.stringify(callData),
    })
  },
 
  // Update call
  update: async (id, callData) => {
    return await apiRequest(`/calls/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(callData),
    })
  },
 
  // Delete call
  delete: async (id) => {
    return await apiRequest(`/calls/delete/${id}`, {
      method: "DELETE",
    })
  },
}
 
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

  forgotPassword: async (email) => {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyOtp: async (email, otp) => {
    return await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (token, newPassword) => {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  changePassword: async (oldPassword, newPassword) => {
    return await apiRequest('/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },
};

export const accessAPI = {
  getAll: async () => {
    const response = await apiRequest('/access/get');
    return response.data;
  }
};

export default {
  mediatorsAPI,
  leadsAPI,
  usersAPI,
  locationsAPI,
  typesAPI,
  callsAPI,
  authAPI,
  accessAPI,
}
