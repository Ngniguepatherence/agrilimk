import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "farmer" | "owner" | "admin" | "collectivity";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  idVerified?: boolean;
  idType?: "cni" | "passport";
  location?: string;
  joinedDate?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  loginWithSocial: (provider: "google" | "facebook") => boolean;
  signup: (name: string, email: string, phone: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: "f1", name: "Amadou Diallo", email: "farmer@agrilink.com", phone: "+221771234567", role: "farmer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", idVerified: true, idType: "cni", location: "Thiès, Senegal", joinedDate: "2025-08-15" },
  { id: "o1", name: "Commune de Thiès", email: "owner@agrilink.com", phone: "+221779876543", role: "owner", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face", idVerified: true, idType: "cni", location: "Thiès, Senegal", joinedDate: "2025-06-01" },
  { id: "a1", name: "Admin AgriLink", email: "admin@agrilink.com", phone: "+221770000000", role: "admin", idVerified: true, location: "Dakar, Senegal", joinedDate: "2025-01-01" },
  { id: "c1", name: "Mairie de Fatick", email: "collectivity@agrilink.com", phone: "+221773334444", role: "collectivity", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face", idVerified: true, location: "Fatick, Senegal", joinedDate: "2025-09-01" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string): boolean => {
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    setUser({ id: "demo", name: "Demo User", email, phone: "", role: "farmer", idVerified: false, joinedDate: new Date().toISOString().split("T")[0] });
    return true;
  };

  const loginWithSocial = (provider: "google" | "facebook"): boolean => {
    setUser({
      id: `social-${Date.now()}`,
      name: provider === "google" ? "Google User" : "Facebook User",
      email: `user@${provider}.com`,
      phone: "",
      role: "farmer",
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
      idVerified: false,
      joinedDate: new Date().toISOString().split("T")[0],
    });
    return true;
  };

  const signup = (name: string, email: string, phone: string, _password: string, role: UserRole): boolean => {
    setUser({ id: `u-${Date.now()}`, name, email, phone, role, idVerified: false, joinedDate: new Date().toISOString().split("T")[0] });
    return true;
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...updates } : null);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginWithSocial, signup, logout, isAuthenticated: !!user, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
