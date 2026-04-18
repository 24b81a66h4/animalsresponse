import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const socketRef = useRef(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user) return;

        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join', user._id);

        socketRef.current.on('notification', (data) => {
            setNotifications((prev) => [{ ...data, id: Date.now(), read: false }, ...prev]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user]);

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const clearNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <SocketContext.Provider value={{ notifications, markAllRead, clearNotification }}>
            {children}
        </SocketContext.Provider>
    );
};