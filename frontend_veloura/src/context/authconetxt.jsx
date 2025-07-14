import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken) {
        setLoading(false); 
        return;
      }

      try {
        setLoading(true); 
        const response = await axios.get('http://localhost:3001/users/profile', { 
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setAuthToken(null);
        localStorage.removeItem('authToken');
        setUser(null); 
      } finally {
        setLoading(false); 
      }
    };

    fetchProfile();
  }, [authToken]); 

  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    sessionStorage.removeItem("user_token"); 
    window.location.href = "/"; 
  };
  

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;