import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLeads } from './LeadsContext';
import { useMediators } from './MediatorsContext';
import { useUsers } from './UsersContext';

const DashboardContext = createContext(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const { leads, fetchLeads, loading: leadsLoading } = useLeads();
  const { mediators, fetchMediators, loading: mediatorsLoading } = useMediators();
  const { users, fetchUsers, loading: usersLoading } = useUsers();
  
  const [dashboardData, setDashboardData] = useState({
    leadsStrategy: {
      total: 0,
      Active: 0,
      Inactive: 0,
      Approved: 0,
      Pending: 0,
      Purchased: 0,
    },
    callStrategy: {
      total: 0,
      hot: 0,
      warm: 0,
      cold: 0,
    },
    workStages: {
      total: 0,
      noAction: 0,
      visitDone: 0,
      negotiation: 0,
      dueDiligence: 0,
    },
    statusMetrics: {
      activeRecords: 0,
      siteVisitPending: 0,
      ownerMeetPending: 0,
      criticalOverdue: 0,
    },
    taskMetrics: {
      openTasks: 0,
      dueInTwoDays: 0,
      overdue: 0,
    },
    allocationMetrics: {
      leadsToAllocate: 0,
      leadsToApprove: 0,
    },
    systemMetrics: {
      totalLeads: 0,
      totalMediators: 0,
      totalUsers: 0,
      activeUsers: 0,
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate dashboard metrics from raw data
  const calculateMetrics = () => {
    try {
      const metrics = { ...dashboardData };

      // Leads Strategy Metrics
      const activeLeads = leads.filter(lead => lead.status === 'active' || lead.lead_status === 'active');
      const holdLeads = leads.filter(lead => lead.status === 'hold' || lead.lead_status === 'hold');
      const lostLeads = leads.filter(lead => lead.status === 'lost' || lead.lead_status === 'lost');
      const pushedLeads = leads.filter(lead => lead.status === 'pushed' || lead.lead_status === 'pushed');

      metrics.leadsStrategy = {
        total: leads.length,
        active: activeLeads.length,
        hold: holdLeads.length,
        lost: lostLeads.length,
        pushed: pushedLeads.length,
      };

      // Call Strategy Metrics (based on priority or temperature)
      const hotLeads = leads.filter(lead => lead.priority === 'high' || lead.temperature === 'hot');
      const warmLeads = leads.filter(lead => lead.priority === 'medium' || lead.temperature === 'warm');
      const coldLeads = leads.filter(lead => lead.priority === 'low' || lead.temperature === 'cold');

      metrics.callStrategy = {
        total: hotLeads.length + warmLeads.length + coldLeads.length,
        hot: hotLeads.length,
        warm: warmLeads.length,
        cold: coldLeads.length,
      };

      // Work Stages Metrics
      const noActionLeads = leads.filter(lead => lead.work_stage === 'no_action' || lead.stage === 'No Action');
      const visitDoneLeads = leads.filter(lead => lead.work_stage === 'visit_done' || lead.stage === 'Visit Done');
      const negotiationLeads = leads.filter(lead => lead.work_stage === 'negotiation' || lead.stage === 'Negotiation');
      const dueDiligenceLeads = leads.filter(lead => lead.work_stage === 'due_diligence' || lead.stage === 'Due Diligence');

      metrics.workStages = {
        total: noActionLeads.length + visitDoneLeads.length + negotiationLeads.length + dueDiligenceLeads.length,
        noAction: noActionLeads.length,
        visitDone: visitDoneLeads.length,
        negotiation: negotiationLeads.length,
        dueDiligence: dueDiligenceLeads.length,
      };

      // Status Metrics
      const siteVisitPending = leads.filter(lead => 
        lead.site_visit_status === 'pending' || lead.visit_status === 'pending'
      );
      const ownerMeetPending = leads.filter(lead => 
        lead.owner_meet_status === 'pending' || lead.meet_status === 'pending'
      );
      const criticalOverdue = leads.filter(lead => {
        const followUpDate = new Date(lead.follow_up_date || lead.next_follow_up);
        const today = new Date();
        return followUpDate < today && (lead.priority === 'high' || lead.status === 'critical');
      });

      metrics.statusMetrics = {
        activeRecords: activeLeads.length,
        siteVisitPending: siteVisitPending.length,
        ownerMeetPending: ownerMeetPending.length,
        criticalOverdue: criticalOverdue.length,
      };

      // Task Metrics (placeholder calculations - adjust based on your actual task system)
      const today = new Date();
      const twoDaysFromNow = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
      
      const openTasks = leads.filter(lead => lead.task_status === 'open').length;
      const dueInTwoDays = leads.filter(lead => {
        const taskDate = new Date(lead.task_due_date);
        return taskDate <= twoDaysFromNow && taskDate >= today;
      }).length;
      const overdue = leads.filter(lead => {
        const taskDate = new Date(lead.task_due_date);
        return taskDate < today && lead.task_status === 'open';
      }).length;

      metrics.taskMetrics = {
        openTasks,
        dueInTwoDays,
        overdue,
      };

      // Allocation Metrics
      const unallocatedLeads = leads.filter(lead => !lead.assigned_to || !lead.mediator_id);
      const pendingApprovalLeads = leads.filter(lead => lead.approval_status === 'pending');

      metrics.allocationMetrics = {
        leadsToAllocate: unallocatedLeads.length,
        leadsToApprove: pendingApprovalLeads.length,
      };

      // System Metrics
      const activeUsers = users.filter(user => user.status === 'active' || user.is_active === true);

      metrics.systemMetrics = {
        totalLeads: leads.length,
        totalMediators: mediators.length,
        totalUsers: users.length,
        activeUsers: activeUsers.length,
      };

      setDashboardData(metrics);
    } catch (err) {
      setError('Failed to calculate dashboard metrics: ' + err.message);
    }
  };

  // Fetch all data and calculate metrics
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data from all contexts
      await Promise.all([
        fetchLeads(),
        fetchMediators(),
        fetchUsers()
      ]);
      
      // Calculate metrics after data is fetched
      calculateMetrics();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-calculate metrics when data changes
  useEffect(() => {
    if (leads.length > 0 || mediators.length > 0 || users.length > 0) {
      calculateMetrics();
    }
  }, [leads, mediators, users]);

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
        loading: loading || leadsLoading || mediatorsLoading || usersLoading,
        error,
        fetchDashboardData,
        refreshDashboard,
        clearError,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;