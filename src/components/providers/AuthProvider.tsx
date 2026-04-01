"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

type AuthContextType = {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check local storage for auth token on mount
    const savedToken = localStorage.getItem("orion_admin_token");
    if (savedToken) {
      setIsAdmin(true);
    }
  }, []);

  // const login = (password: string) => {
  //   // Dummy authentication: password is 'admin123'
  //   if (password === "admin123") {
  //     setIsAdmin(true);
  //     localStorage.setItem("orion_admin_auth", "true");
  //     router.push("/admin");
  //     return true;
  //   }
  //   return false;
  // };

  // --- BACKEND INTEGRATION POINT: ADMIN LOGIN ---
  // Example implementation using standard fetch:
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      // Parse JSON even if response is 401/400 to get error messages
      const result = await response.json().catch(() => ({}));
      
      if (response.ok && result.success && result.data && result.data.token) {
        localStorage.setItem("orion_admin_token", result.data.token);
        setIsAdmin(true);
        router.push("/admin");
        return true;
      }
      
      console.warn("Login failed:", result.message || "Invalid credentials");
      return false;
    } catch (error) {
      console.warn("Network error during login:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("orion_admin_token");
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
