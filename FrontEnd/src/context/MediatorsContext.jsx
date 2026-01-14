import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mediatorsAPI } from '../services/api';

const MediatorsContext = createContext();

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

  const fetchMediators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediatorsAPI.getAll();
      setMediators(response); // Response is already an array
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMediatorById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediatorsAPI.getById(id);
      return response; // Response is already mediator object
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMediator = async (mediatorData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mediatorsAPI.create(mediatorData);
      setMediators(prev => [...prev, response]); // Response is already mediator object
      return response;
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
      setMediators(prev => 
        prev.map(mediator => 
          mediator._id === id 
            ? { ...mediator, ...response } // Response is already updated mediator object
            : mediator
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
      await mediatorsAPI.delete(id);
      setMediators(prev => prev.filter(mediator => mediator._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    mediators,
    loading,
    error,
    fetchMediators,
    getMediatorById,
    createMediator,
    updateMediator,
    deleteMediator,
    clearError,
  };

  return (
    <MediatorsContext.Provider value={value}>
      {children}
    </MediatorsContext.Provider>
  );
};

export default MediatorsContext;
