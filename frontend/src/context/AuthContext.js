import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Set base URL for API calls
    axios.defaults.baseURL = 'http://localhost:5000/api';

    // Set up axios interceptor for authentication
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [currentUser]);

    useEffect(() => {
        // Check if user is already logged in
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (userId && token) {
            // Get user data
            getCurrentUser(userId);
        } else {
            setLoading(false);
        }
    }, []);

    const getCurrentUser = async (userId) => {
        try {
            const response = await axios.get(`/auth/user/${userId}`);
            setCurrentUser(response.data.user);
        } catch (err) {
            console.error('Get current user error:', err);
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        try {
            const response = await axios.post('/auth/signin', { email, password });
            const { user, token } = response.data;
            localStorage.setItem('userId', user.id);
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setCurrentUser(user);
            setError('');
            return true;
        } catch (err) {
            console.error('Sign in error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Sign in failed');
            return false;
        }
    };

    const signUp = async (userData) => {
        try {
            const response = await axios.post('/auth/signup', userData);
            const { user, token } = response.data;
            localStorage.setItem('userId', user.id);
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setCurrentUser(user);
            setError('');
            return true;
        } catch (err) {
            console.error('Sign up error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Sign up failed');
            return false;
        }
    };

    const signOut = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        error,
        signIn,
        signUp,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 