import React, { useState, useContext, createContext, useEffect } from "react";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const authData = JSON.parse(localStorage.getItem("hamza_auth"));
    if (authData) {
      setUser(authData);
    }
  }, []);

  const login = (user) => {
    setUser(user);

    localStorage.setItem("hamza_auth", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hamza_auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
