import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Store user object: { isLoggedIn, role, email, id }
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("btd_user");
    return stored ? JSON.parse(stored) : { isLoggedIn: false, role: null, email: null, id: null };
  });

  useEffect(() => {
    localStorage.setItem("btd_user", JSON.stringify(user));
  }, [user]);

  // Accepts a user object and token from backend
  const login = (userData, token) => {
    if (typeof userData === 'object' && userData !== null) {
      setUser({
        isLoggedIn: true,
        role: userData.role,
        email: userData.email,
        id: userData.id
      });
      // Store the token
      localStorage.setItem("btd_token", token);
    }
  };

  const logout = () => {
    setUser({ isLoggedIn: false, role: null, email: null, id: null });
    // Remove both user data and token
    localStorage.removeItem("btd_user");
    localStorage.removeItem("btd_token");
  };

  return (
    <AuthContext.Provider value={{ ...user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 