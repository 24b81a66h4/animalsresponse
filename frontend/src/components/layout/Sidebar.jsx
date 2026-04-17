import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Sidebar() {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    const role = user.role;

    const links = {
        user: [
            { name: 'Dashboard', path: '/user' },
            { name: 'My Complaints', path: '/user/complaints' },
            { name: 'Submit Complaint', path: '/user/submit' }
        ],
        admin: [
            { name: 'Dashboard', path: '/admin' },
            { name: 'All Complaints', path: '/admin/complaints' },
            { name: 'NGO Management', path: '/admin/ngos' },
            { name: 'Analytics', path: '/admin/analytics' }
        ],
        ngo: [
            { name: 'Dashboard', path: '/ngo' },
            { name: 'Assigned Complaints', path: '/ngo/assigned' }
        ]
    };

    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-4">

            <h2 className="text-lg font-semibold mb-4">Menu</h2>

            <ul className="space-y-2">
                {links[role]?.map((link, index) => (
                    <li key={index}>
                        <a
                            href={link.path}
                            className="block p-2 rounded hover:bg-gray-700"
                        >
                            {link.name}
                        </a>
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default Sidebar;