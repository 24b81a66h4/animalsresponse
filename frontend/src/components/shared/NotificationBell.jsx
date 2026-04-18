import React, { useState, useContext, useRef, useEffect } from 'react';
import { SocketContext } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const { notifications, markAllRead, clearNotification, markAsRead } = useContext(SocketContext);
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

    const formatTime = (date) => {
        if (!date) return 'just now';
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => { 
                    setOpen(!open); 
                    if (!open) markAllRead(); 
                }}
                className="relative p-2 rounded-lg hover:bg-emerald-700 transition"
            >
                <span className="text-xl">🔔</span>
                {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <span className="text-sm font-bold text-gray-700">Notifications</span>
                        <span className="text-xs text-gray-400">{notifications.length} total</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <p className="text-3xl mb-2">📭</p>
                                <p className="text-sm text-gray-400">All caught up! No new notifications.</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n._id || n.id}
                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-start gap-2 transition ${!n.read ? 'bg-blue-50/30' : ''}`}
                                    onClick={() => {
                                        const cId = n.complaint_id || n.complaintId;
                                        if (cId) navigate(`/user/complaints/${cId}`);
                                        markAsRead(n._id || n.id);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex-1">
                                        <p className={`text-sm ${!n.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                            {n.title && <span className="block text-xs uppercase text-emerald-600 font-bold mb-0.5">{n.title}</span>}
                                            {n.message}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                            🕒 {formatTime(n.createdAt)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            clearNotification(n._id || n.id); 
                                        }}
                                        className="text-gray-300 hover:text-red-500 text-xs mt-0.5 transition"
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