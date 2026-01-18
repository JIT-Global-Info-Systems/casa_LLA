// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { dashboardAPI } from '../services/api';

// const DashboardContext = createContext();

// export const useDashboard = () => {
//   const context = useContext(DashboardContext);
//   if (!context) {
//     throw new Error('useDashboard must be used within a DashboardProvider');
//   }
//   return context;
// };

// export const DashboardProvider = ({ children }) => {
//   const [stats, setStats] = useState({});
//   const [charts, setCharts] = useState({});
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await dashboardAPI.getStats();
//       setStats(response.data || response);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCharts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await dashboardAPI.getCharts();
//       setCharts(response.data || response);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRecentActivity = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await dashboardAPI.getRecentActivity();
//       setRecentActivity(response.data || response);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const [statsResponse, chartsResponse, activityResponse] = await Promise.all([
//         dashboardAPI.getStats(),
//         dashboardAPI.getCharts(),
//         dashboardAPI.getRecentActivity()
//       ]);

//       setStats(statsResponse.data || statsResponse);
//       setCharts(chartsResponse.data || chartsResponse);
//       setRecentActivity(activityResponse.data || activityResponse);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearError = () => setError(null);

//   const value = {
//     stats,
//     charts,
//     recentActivity,
//     loading,
//     error,
//     fetchStats,
//     fetchCharts,
//     fetchRecentActivity,
//     fetchAllDashboardData,
//     clearError,
//   };

//   return (
//     <DashboardContext.Provider value={value}>
//       {children}
//     </DashboardContext.Provider>
//   );
// };

// export default DashboardContext;
