import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import API from '../services/api';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const socketRef = useRef(null);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const res = await API.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        // Fetch historical notifications
        fetchNotifications();

        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join', user._id);

        socketRef.current.on('notification', (data) => {
            // Add real-time notification to the top of the list
            setNotifications((prev) => [data, ...prev]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user]);

    const markAllRead = async () => {
        try {
            // For now, we update local state immediately
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            
            // Mark individual notifications as read in the DB
            const unread = notifications.filter(n => !n.read);
            await Promise.all(unread.map(n => API.put(`/notifications/${n._id}/read`)));
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const clearNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => (n._id || n.id) !== id));
    };

    return (
        <SocketContext.Provider value={{ notifications, markAllRead, markAsRead, clearNotification, fetchNotifications }}>
            {children}
        </SocketContext.Provider>
    );
};