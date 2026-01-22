import React, { createContext, useContext, useState, useCallback } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching leads from API...');
      const response = await leadsAPI.getAll();
      console.log('API response:', response);
      setLeads(response.data ?? response);
      console.log('Leads set:', response.data ?? response);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getLeadById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getById(id);
      return response.data ?? response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLead = useCallback(async (leadData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.create(leadData);
      setLeads(prev => [...prev, response.data ?? response]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLead = useCallback(async (id, leadData, files = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.update(id, leadData, files);
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
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLead = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await leadsAPI.delete(id);
      setLeads(prev =>
        prev.filter(lead => lead._id !== id && lead.id !== id)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <LeadsContext.Provider
      value={{
        leads,
        loading,
        error,
        fetchLeads,
        getLeadById,
        createLead,
        updateLead,
        deleteLead,
        clearError,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export default LeadsContext;
