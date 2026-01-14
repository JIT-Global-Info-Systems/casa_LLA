import React, { createContext, useContext, useState, useEffect } from 'react';
import { leadsAPI } from '../services/api';

const LeadsContext = createContext();

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

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getAll();
      setLeads(response.data || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLeadById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getById(id);
      return response.data || response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (leadData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.create(leadData);
      setLeads(prev => [...prev, response.data || response]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (id, leadData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.update(id, leadData);
      setLeads(prev => 
        prev.map(lead => 
          lead._id === id || lead.id === id 
            ? { ...lead, ...(response.data || response) }
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
  };

  const deleteLead = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await leadsAPI.delete(id);
      setLeads(prev => prev.filter(lead => lead._id !== id && lead.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    leads,
    loading,
    error,
    fetchLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    clearError,
  };

  return (
    <LeadsContext.Provider value={value}>
      {children}
    </LeadsContext.Provider>
  );
};

export default LeadsContext;
