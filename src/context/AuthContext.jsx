import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Keep current logged-in user session from localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse user from local storage:', error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .single();

        if (error || !data) {
            return { success: false, error: 'Invalid email or password' };
        }

        const userWithoutPassword = { ...data };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return { success: true };
    };

    const signup = async (userData) => {
        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('email')
            .eq('email', userData.email);

        if (existingUser && existingUser.length > 0) {
            return { success: false, error: 'User already exists' };
        }

        // Check if an admin already exists
        if (userData.role === 'admin') {
            const { data: adminExists } = await supabase
                .from('users')
                .select('role')
                .eq('role', 'admin');
            
            if (adminExists && adminExists.length > 0) {
                return { success: false, error: 'An admin account already exists. Only one admin is allowed.' };
            }
        }

        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role || 'customer'
        };

        const { error } = await supabase.from('users').insert([newUser]);
        
        if (error) {
            console.error("Database Error:", error.message);
            return { success: false, error: 'Failed to create user in database' };
        }

        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const resetPassword = async (email, newPassword) => {
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email);

        if (!existingUser || existingUser.length === 0) {
            return { success: false, error: 'Email not found' };
        }

        const { error } = await supabase
            .from('users')
            .update({ password: newPassword })
            .eq('email', email);

        if (error) {
            console.error("Database Error:", error.message);
            return { success: false, error: 'System error updating password' };
        }

        return { success: true };
    };

    const value = {
        user,
        login,
        signup,
        logout,
        resetPassword,
        loading,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
