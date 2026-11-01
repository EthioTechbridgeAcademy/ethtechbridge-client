import React, { createContext, useContext, useState, useEffect } from "react";
import { api, getAuthToken, setAuthToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => getAuthToken());
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    async function loadUser() {
      const savedToken = getAuthToken();
      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const { user: profile } = await api.getMe();
        setUser(profile);
      } catch (err) {
        console.warn("Session expired or invalid, logging out:", err.message);
        setAuthToken(null);
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function login(email, password) {
    const res = await api.login({ email, password });
    if (res.token) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
    }
    return res.user;
  }

  async function register(formData) {
    const res = await api.register(formData);
    if (res.token) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
    }
    return res.user;
  }

  function setSession(newToken, newUser) {
    if (newToken) {
      setAuthToken(newToken);
      setTokenState(newToken);
      setUser(newUser || null);
    } else {
      logout();
    }
  }

  function logout() {
    api.logout().catch(() => {});
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  }

  function updateUser(updates) {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isInstructor: user?.role === "instructor",
    isStudent: user?.role === "student",
    login,
    register,
    logout,
    setSession,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Graceful fallback so components never throw or crash the app
    const savedToken = getAuthToken();
    return {
      user: null,
      token: savedToken,
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      isInstructor: false,
      isStudent: false,
      login: async () => {},
      register: async () => {},
      logout: () => {},
      updateUser: () => {}
    };
  }
  return context;
}
