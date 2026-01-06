import axios from "axios";
import React, { createContext, useEffect, useState, type ReactNode } from "react";

// Define the shape of your context data
interface AuthContextType {
  authenticated: boolean | null;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}

// Create the context (with an initial default value)
export const AuthContext = createContext<AuthContextType>({
  authenticated: null,
  setAuthenticated: () => {},
});

// Context Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const check = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/api/protected`, {
            withCredentials: true,
            });
            setAuthenticated(true);
        } catch {
            setAuthenticated(false);
        }
        };

        check();
    }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
