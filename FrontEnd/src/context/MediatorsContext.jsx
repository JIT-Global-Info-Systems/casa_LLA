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

  const fetchMediators = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediatorsAPI.getAll();
      setMediators(response);
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
      const deleted = response.data ?? response;

      // Remove from local state or update status to inactive
      setMediators(prev =>
        prev.map(m =>
          m._id === id ? { ...m, ...deleted } : m
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

  const clearError = () => setError(null);

  return (
    <MediatorsContext.Provider
      value={{
        mediators,
        loading,
        error,
        fetchMediators,
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
