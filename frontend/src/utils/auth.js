// frontend/src/utils/auth.js
export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };
  
  // Add more utility functions as needed...