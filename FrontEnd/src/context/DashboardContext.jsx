import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const DashboardContext = createContext(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    leadStatusCounts: {},
    leadStageCounts: {},
    workStageCounts: {},
    totals: {
      approvedLeads: 0,
      pendingLeads: 0,
      purchasedLeads: 0
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch dashboard data from API
  const fetchDashboardData = async (dashboardFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardAPI.getDashboardData(dashboardFilters);
      setDashboardData(response);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update filters and refetch data
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Mark as initialized after first filter update
    if (!isInitialized) {
      setIsInitialized(true);
    }
  };

  // Auto-fetch data when filters change (but not on initial mount)
  useEffect(() => {
    if (isInitialized && Object.keys(filters).length > 0) {
      fetchDashboardData(filters);
    }
  }, [filters, isInitialized]);

  // Refresh dashboard data
  const refreshDashboard = () => {
    fetchDashboardData();
  };

  // Clear error
  const clearError = () => setError(null);

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        loading,
        error,
        fetchDashboardData,
        refreshDashboard,
        clearError,
        filters,
        updateFilters,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;