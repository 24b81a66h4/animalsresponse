import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user on mount");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await API.post('/auth/login', { email, password });

            // 🔥 IMPORTANT FIX
            const { token, user } = response.data;

            // Save token separately
            localStorage.setItem('token', token);

            // Save user separately
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);

            return user;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (userData) => {
        try {
            const response = await API.post('/auth/register', userData);

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);

            return user;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // 🔥 also remove token
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};