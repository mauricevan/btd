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

  // Accepts a user object from backend
  const login = (roleOrUser) => {
    if (typeof roleOrUser === 'object' && roleOrUser !== null) {
      setUser({
        isLoggedIn: true,
        role: roleOrUser.role,
        email: roleOrUser.email,
        id: roleOrUser.id
      });
    } else {
      setUser({ isLoggedIn: true, role: roleOrUser, email: null, id: null });
    }
  };
  const logout = () => {
    setUser({ isLoggedIn: false, role: null, email: null, id: null });
    localStorage.removeItem("btd_user");
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