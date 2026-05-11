import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { role: string } | null;
  login: (token: string) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await api.get("/admin/me");
        if (response.data) {
          setIsAuthenticated(true);
          setUser({ role: "admin", ...response.data });
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("admin_token");
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("admin_token", token);
    setIsAuthenticated(true);
    setUser({ role: "admin" });
  };

  const logout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("admin_token");
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
