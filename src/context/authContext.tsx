"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getProfile, login } from "../services/auth";
import axios from "axios";
import Cookies from "js-cookie";

interface User {
  id: string;
  nomeFantasia: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  login: (params: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const defaultProvider: AuthContextType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => null,
  login: async () => { },
  logout: () => { },
};

const AuthContext = createContext<AuthContextType>(defaultProvider);

export const isAuthenticated = (): boolean => {
  return Cookies.get("access-token") !== undefined;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);

  useEffect(() => {
    const recoverUser = Cookies.get("userData");
    const accessToken = Cookies.get("access-token");

    const validateToken = async () => {
      setLoading(true);
      if (recoverUser && accessToken) {
        try {
          await getProfile(accessToken);
          setUser(JSON.parse(recoverUser));
        } catch (error) {
          console.error("Erro ao validar o token:", error);
          handleLogout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const handleLogin = async (params: { email: string; password: string }): Promise<void> => {
    try {
      const { user, token } = await login(params);
      setUser(user);
      Cookies.set("access-token", token, { expires: 1 });
      Cookies.set("userData", JSON.stringify(user), { expires: 1 });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data?.message || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      Cookies.remove("userData");
      Cookies.remove("access-token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
