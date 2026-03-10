import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "farmer" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, phone: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: "f1", name: "Amadou Diallo", email: "farmer@agrilink.com", phone: "+221771234567", role: "farmer" },
  { id: "o1", name: "Commune de Thiès", email: "owner@agrilink.com", phone: "+221779876543", role: "owner" },
  { id: "a1", name: "Admin AgriLink", email: "admin@agrilink.com", phone: "+221770000000", role: "admin" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string): boolean => {
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    // Auto-create for demo
    setUser({ id: "demo", name: "Demo User", email, phone: "", role: "farmer" });
    return true;
  };

  const signup = (name: string, email: string, phone: string, _password: string, role: UserRole): boolean => {
    setUser({ id: `u-${Date.now()}`, name, email, phone, role });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
