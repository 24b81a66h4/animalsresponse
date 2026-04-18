import React, { useState, useContext, useRef, useEffect } from 'react';
import { SocketContext } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const { notifications, markAllRead, clearNotification } = useContext(SocketContext);
    const [open, setOpen] = useState(false);
    const ref = useRef();
    const navigate = useNavigate();

    const unread = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => { setOpen(!open); markAllRead(); }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition"
            >
                <span className="text-xl">🔔</span>
                {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Notifications</span>
                        <span className="text-xs text-gray-400">{notifications.length} total</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">No notifications yet</p>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-start gap-2"
                                    onClick={() => {
                                        navigate(`/user/complaints/${n.complaintId}`);
                                        setOpen(false);
                                    }}
                                >
                                    <div>
                                        <p className="text-sm text-gray-700">{n.message}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">just now</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); clearNotification(n.id); }}
                                        className="text-gray-300 hover:text-gray-500 text-xs mt-0.5"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;