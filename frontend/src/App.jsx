import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { SocketProvider } from './context/SocketContext';

function App() {
    return (
        <SocketProvider>
            <Router>
                <AppRoutes />
            </Router>
        </SocketProvider>
    );
}

export default App;