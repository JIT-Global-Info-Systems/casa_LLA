import React, { createContext, useContext, useState } from 'react';
import { mediatorsAPI } from '../services/api';

const MediatorsContext = createContext(null);

export const useMediators = () => {
  const context = useContext(MediatorsContext);
  if (!context) {
    throw new Error('useMediators must be used within a MediatorsProvider');
  }
  return context;
};

export const MediatorsProvider = ({ children }) => {
  const [mediators, setMediators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchMediators = async () => {
    // Prevent multiple simultaneous calls
    if (loading || fetched) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await mediatorsAPI.getAll();
      setMediators(response);
      setFetched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMediatorById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      return await mediatorsAPI.getById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMediator = async (mediatorData, files = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediatorsAPI.create(mediatorData, files);
      setMediators(prev => [...prev, response.data]);
      // Reset fetched state to allow refetching if needed
      setFetched(false);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMediator = async (id, mediatorData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediatorsAPI.update(id, mediatorData);
      const updated = response.data ?? response;

      setMediators(prev =>
        prev.map(m =>
          m._id === id ? { ...m, ...updated } : m
        )
      );

      // Reset fetched state to allow refetching if needed
      setFetched(false);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMediator = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediatorsAPI.delete(id);

      // Remove the deleted mediator from local state
      setMediators(prev => prev.filter(m => m._id !== id));

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const refetchMediators = async () => {
    setFetched(false);
    await fetchMediators();
  };

  return (
    <MediatorsContext.Provider
      value={{
        mediators,
        loading,
        error,
        fetched,
        fetchMediators,
        refetchMediators,
        getMediatorById,
        createMediator,
        updateMediator,
        deleteMediator,
        clearError,
      }}
    >
      {children}
    </MediatorsContext.Provider>
  );
};

export default MediatorsContext;
