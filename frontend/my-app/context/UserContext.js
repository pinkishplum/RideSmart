import React, { createContext, useState, useContext } from 'react';

// Create User Context
const UserContext = createContext();

// Create Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    user_id: null,
    first_name: '',
    last_name: '',
    email: '',
  });

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook for accessing user data
export const useUser = () => {
  return useContext(UserContext);
};