import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Navbar() {
    const { user, setUser } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <div className="flex justify-between items-center px-6 py-3 bg-white shadow">

            {/* Logo */}
            <h1 className="text-xl font-bold text-blue-600">
                Animal Rescue
            </h1>

            {/* User Info */}
            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-sm text-gray-600">
                        {user.name} ({user.role})
                    </span>
                )}

                {user && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                )}
            </div>

        </div>
    );
}

export default Navbar;