"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check local storage for mock auth state on mount
    const savedAuth = localStorage.getItem("orion_admin_auth");
    if (savedAuth === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = (password: string) => {
    // Dummy authentication: password is 'admin123'
    if (password === "admin123") {
      setIsAdmin(true);
      localStorage.setItem("orion_admin_auth", "true");
      router.push("/admin");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("orion_admin_auth");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
