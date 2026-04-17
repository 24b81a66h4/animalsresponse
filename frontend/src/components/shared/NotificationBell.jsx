import { useEffect, useState } from 'react';
import API from '../../services/api';

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await API.get('/notifications');
                setNotifications(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative cursor-pointer">

            🔔

            {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                    {unreadCount}
                </span>
            )}

        </div>
    );
}

export default NotificationBell;