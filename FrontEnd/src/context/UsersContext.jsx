import React, { createContext, useContext, useState } from 'react';
import { usersAPI } from '../services/api';
 
const UsersContext = createContext(null);
 
export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
 
export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getAll();
      setUsers(response);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      // Don't throw - let UI handle the error state
    } finally {
      setLoading(false);
    }
  };
 
  const getUserById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getById(id);
      return response;
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
 
  const createUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
     
      // Add created_by field from localStorage or use a default value
      const createdBy = localStorage.getItem('userId') || userData.created_by || '65a9c4e7f1b2d12345678900';
      const userDataWithCreator = { ...userData, created_by: createdBy };
     
      const response = await usersAPI.create(userDataWithCreator);
     
      // Handle different response formats
      if (response.user) {
        setUsers(prev => [...prev, response.user]);
        return response.user;
      } else if (response.data) {
        setUsers(prev => [...prev, response.data]);
        return response.data;
      } else {
        setUsers(prev => [...prev, response]);
        return response;
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
 
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.update(id, userData);
      
      // Handle different response formats
      let updated;
      if (response.user) {
        updated = response.user;
      } else if (response.data) {
        updated = response.data;
      } else {
        updated = response;
      }

      setUsers(prev =>
        prev.map(user =>
          user.user_id === id
            ? { ...user, ...updated }
            : user
        )
      );

      return updated;
    } catch (err) {
      // console.error('Error updating user:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
 
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await usersAPI.delete(id);
      setUsers(prev =>
        prev.filter(user => user.user_id !== id)
      );
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
 
  const clearError = () => setError(null);
 
  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        error,
        fetchUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        clearError,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
 
export default UsersContext;
 
 