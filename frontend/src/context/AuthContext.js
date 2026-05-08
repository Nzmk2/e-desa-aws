import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("edesa_user") || "null"); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // verifikasi token saat app load
    const token = localStorage.getItem("edesa_token");
    if (token && !user) {
      api.get("/auth/me").then((r) => {
        setUser(r.data);
        localStorage.setItem("edesa_user", JSON.stringify(r.data));
      }).catch(() => {});
    }
    // eslint-disable-next-line
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("edesa_token", data.token);
      localStorage.setItem("edesa_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally { setLoading(false); }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      localStorage.setItem("edesa_token", data.token);
      localStorage.setItem("edesa_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem("edesa_token");
    localStorage.removeItem("edesa_user");
    setUser(null);
  };

  const updateUser = (u) => {
    setUser(u);
    localStorage.setItem("edesa_user", JSON.stringify(u));
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
