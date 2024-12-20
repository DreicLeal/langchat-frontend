"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AuthContextType, User } from "./interfaces";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("@token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);
  const login = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    console.log(jwtToken)
    localStorage.setItem("@token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("@token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
