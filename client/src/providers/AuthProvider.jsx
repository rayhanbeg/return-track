import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to handle user login
  const signIn = async (email, password) => {
    // Perform login logic
    // For example, call your backend API to authenticate user
    try {
      // Call your backend API to authenticate user
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password,
      });

      // Set user data and token in local storage upon successful login
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);

      // Set user state
      setUser(response.data.user);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Function to handle user logout
  const logOut = () => {
    // Clear user data and token from local storage upon logout
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Clear user state
    setUser(null);
  };

  useEffect(() => {
    // Check if user is already logged in (i.e., user data and token exist in local storage)
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      // Set user state if user is logged in
      setUser(JSON.parse(storedUser));
    }

    // Set loading state to false
    setLoading(false);
  }, []);

  const authInfo = {
    user,
    loading,
    signIn,
    logOut,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  // Array of children.
  children: PropTypes.array,
};

export default AuthProvider;
