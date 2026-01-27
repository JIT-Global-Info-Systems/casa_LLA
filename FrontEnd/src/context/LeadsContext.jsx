import React, { createContext, useContext, useState } from 'react';
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
  const [error, setError] = useState(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getAll();
      setLeads(response.data ?? response);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message);
      // Don't throw - let UI handle the error state
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getApproved();
      setApprovedLeads(response.data ?? response);
    } catch (err) {
      console.error('Error fetching approved leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchasedLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadsAPI.getPurchased();
      setPurchasedLeads(response.data ?? response);
    } catch (err) {
      console.error('Error fetching purchased leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLeadStatuses = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchLeads(),
        fetchApprovedLeads(),
        fetchPurchasedLeads()
      ]);
    } catch (err) {
      console.error('Error fetching all lead statuses:', err);
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
      return response.data ?? response;
    } catch (err) {
      console.error('Error fetching lead:', err);
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
      setLeads(prev => [...prev, response.data ?? response]);
      return response;
    } catch (err) {
      console.error('Error creating lead:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (id, leadData, files = {}) => {
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
      console.error('Error updating lead:', err);
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
      setLeads(prev =>
        prev.filter(lead => lead._id !== id && lead.id !== id)
      );
    } catch (err) {
      console.error('Error deleting lead:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <LeadsContext.Provider
      value={{
        leads,
        approvedLeads,
        purchasedLeads,
        loading,
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
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export default LeadsContext;
