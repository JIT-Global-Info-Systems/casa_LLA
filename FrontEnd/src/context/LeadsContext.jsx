import React, { createContext, useContext, useState, useRef } from 'react';
import { leadsAPI } from '../services/api';

const LeadsContext = createContext(null);

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};

export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [approvedLeads, setApprovedLeads] = useState([]);
  const [purchasedLeads, setPurchasedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({}); // Track individual action loading
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Request deduplication using refs to track ongoing requests
  const ongoingRequests = useRef(new Set());
  const abortControllers = useRef(new Map());

  // Helper to create unique request keys
  const getRequestKey = (operation, id = null) => {
    return id ? `${operation}_${id}` : operation;
  };

  // Helper to manage request lifecycle
  const withRequestDeduplication = async (requestKey, requestFn) => {
    // If request is already ongoing, return early
    if (ongoingRequests.current.has(requestKey)) {
      console.log(`Request ${requestKey} already in progress, skipping`);
      return;
    }

    // Create abort controller for this request
    const controller = new AbortController();
    abortControllers.current.set(requestKey, controller);
    ongoingRequests.current.add(requestKey);

    try {
      const result = await requestFn(controller.signal);
      return result;
    } finally {
      // Cleanup
      ongoingRequests.current.delete(requestKey);
      abortControllers.current.delete(requestKey);
    }
  };

  // Cancel all ongoing requests (useful for cleanup)
  const cancelAllRequests = () => {
    abortControllers.current.forEach(controller => {
      controller.abort();
    });
    abortControllers.current.clear();
    ongoingRequests.current.clear();
  };

  const fetchLeads = async (showToast = false) => {
    const requestKey = getRequestKey('fetchLeads');
    
    return withRequestDeduplication(requestKey, async (signal) => {
      try {
        setActionLoading(prev => ({ ...prev, fetchLeads: true }));
        setError(null); // Clear previous errors
        
        const response = await leadsAPI.getAll();
        
        // Check if request was aborted
        if (signal.aborted) return;
        
        console.log('API response:', response);
        // Handle both response formats: { data: [...] } or direct array
        const leadsData = response.data || response;
        setLeads(Array.isArray(leadsData) ? leadsData : []);
        console.log('Leads set:', Array.isArray(leadsData) ? leadsData : []);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch leads request was cancelled');
          return;
        }
        console.error('Error fetching leads:', err);
        setError(err.message);
        // Don't throw - let UI handle the error state
      } finally {
        setActionLoading(prev => ({ ...prev, fetchLeads: false }));
      }
    });
  };

  const fetchApprovedLeads = async () => {
    const requestKey = getRequestKey('fetchApprovedLeads');
    
    return withRequestDeduplication(requestKey, async (signal) => {
      try {
        setLoading(true);
        setError(null);
        const response = await leadsAPI.getApproved();
        
        if (signal.aborted) return;
        
        setApprovedLeads(response.data ?? response);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching approved leads:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
  };

  const fetchPurchasedLeads = async () => {
    const requestKey = getRequestKey('fetchPurchasedLeads');
    
    return withRequestDeduplication(requestKey, async (signal) => {
      try {
        setLoading(true);
        setError(null);
        const response = await leadsAPI.getPurchased();
        
        if (signal.aborted) return;
        
        setPurchasedLeads(response.data ?? response);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching purchased leads:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
  };

  const fetchAllLeadStatuses = async () => {
    const requestKey = getRequestKey('fetchAllLeadStatuses');
    
    return withRequestDeduplication(requestKey, async (signal) => {
      try {
        setLoading(true);
        setError(null);
        
        // Use Promise.allSettled to handle partial failures gracefully
        const results = await Promise.allSettled([
          fetchLeads(),
          fetchApprovedLeads(),
          fetchPurchasedLeads()
        ]);
        
        if (signal.aborted) return;
        
        // Check for any failures
        const failures = results.filter(result => result.status === 'rejected');
        if (failures.length > 0) {
          console.warn('Some lead status fetches failed:', failures);
          setError('Some data could not be loaded. Please try refreshing.');
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching all lead statuses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
  };

  const getLeadById = async (id) => {
    const requestKey = getRequestKey('getLeadById', id);
    
    return withRequestDeduplication(requestKey, async (signal) => {
      try {
        setLoading(true);
        setError(null);
        const response = await leadsAPI.getById(id);
        
        if (signal.aborted) return;
        
        return response.data ?? response;
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error fetching lead:', err);
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    });
  };

  const createLead = async (leadData) => {
    const requestKey = getRequestKey('createLead');
    
    return withRequestDeduplication(requestKey, async (signal) => {
      try {
        setActionLoading(prev => ({ ...prev, createLead: true }));
        setError(null); // Clear previous errors
        const response = await leadsAPI.create(leadData);
        
        if (signal.aborted) return;
        
        const newLead = response.data ?? response;
        setLeads(prev => [...prev, newLead]);
        return response;
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error creating lead:', err);
        setError(err.message);
        throw err;
      } finally {
        setActionLoading(prev => ({ ...prev, createLead: false }));
      }
    });
  };

  const updateLead = async (id, leadData, files = {}) => {
    const requestKey = getRequestKey('updateLead', id);
    
    return withRequestDeduplication(requestKey, async (signal) => {
      try {
        setActionLoading(prev => ({ ...prev, [`updateLead_${id}`]: true }));
        setError(null); // Clear previous errors
        const response = await leadsAPI.update(id, leadData, files);
        
        if (signal.aborted) return;
        
        const updated = response.data ?? response;

        setLeads(prev =>
          prev.map(lead =>
            lead._id === id || lead.id === id
              ? { ...lead, ...updated }
              : lead
          )
        );

        return response;
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error updating lead:', err);
        setError(err.message);
        throw err;
      } finally {
        setActionLoading(prev => ({ ...prev, [`updateLead_${id}`]: false }));
      }
    });
  };

  const deleteLead = async (id) => {
    const requestKey = getRequestKey('deleteLead', id);
    
    return withRequestDeduplication(requestKey, async (signal) => {
      try {
        setActionLoading(prev => ({ ...prev, [`deleteLead_${id}`]: true }));
        setError(null); // Clear previous errors
        await leadsAPI.delete(id);
        
        if (signal.aborted) return;
        
        setLeads(prev =>
          prev.filter(lead => lead._id !== id && lead.id !== id)
        );
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error deleting lead:', err);
        setError(err.message);
        throw err;
      } finally {
        setActionLoading(prev => ({ ...prev, [`deleteLead_${id}`]: false }));
      }
    });
  };

  const clearError = () => setError(null);

  // Retry mechanism for failed operations
  const retryLastOperation = async () => {
    if (retryCount >= 3) {
      setError('Maximum retry attempts reached. Please refresh the page.');
      return;
    }
    
    setRetryCount(prev => prev + 1);
    await fetchLeads(true);
  };

  // Check if any action is loading
  const isAnyActionLoading = () => {
    return Object.values(actionLoading).some(loading => loading);
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        approvedLeads,
        purchasedLeads,
        loading,
        actionLoading,
        error,
        fetchLeads,
        fetchApprovedLeads,
        fetchPurchasedLeads,
        fetchAllLeadStatuses,
        getLeadById,
        createLead,
        updateLead,
        deleteLead,
        clearError,
        retryLastOperation,
        isAnyActionLoading,
        cancelAllRequests, // Expose for cleanup
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export default LeadsContext;
