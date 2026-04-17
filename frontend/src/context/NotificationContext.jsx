import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const res = await API.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === id ? { ...n, read: true } : n
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, fetchNotifications, markAsRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
};