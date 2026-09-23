import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check logged-in user when app starts
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get("/auth/me/");
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login
    const login = async (email, password) => {
        const response = await api.post("/auth/login/", {
            email,
            password,
        });

        setUser(response.data.user);

        return response.data;
    };

    // Logout
    const logout = async () => {
        try {
            await api.post("/auth/logout/");
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}