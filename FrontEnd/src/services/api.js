const API_BASE_URL = 'http://localhost:5000/api';

// Generic API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
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

  // Create new mediator
  create: async (mediatorData) => {
    return await apiRequest('/mediators/create', {
      method: 'POST',
      body: JSON.stringify(mediatorData),
    });
  },

  // Update mediator
  update: async (id, mediatorData) => {
    return await apiRequest(`/mediators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mediatorData),
    });
  },

  // Delete mediator
  delete: async (id) => {
    return await apiRequest(`/mediators/${id}`, {
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
  authAPI,
};